// Reddit public JSON API — no API key required.
// Requires a descriptive User-Agent to avoid 429s.

const UA = "FindMyCommunity/1.0 (indie game audience research; contact: hello@findmycommunity.dev)";

// Pattern to classify a subreddit as gaming-related
const GAMING_PATTERN = /game|gaming|gamer|rpg|indie|steam|playstation|xbox|nintendo|pixel|retro|roguelike|metroidvania|zelda|pokemon|mario|sonic|minecraft|fortnite|valorant|pcgaming|fps|mmo|jrpg|arpg|shooter|strategy|survival|puzzle|platformer|adventure|vr|esport/i;

function isGamingSub(sub: string): boolean {
  return GAMING_PATTERN.test(sub);
}

// Subreddits that appear everywhere and add no signal
const NOISE_SUBS = new Set([
  "AskReddit", "funny", "pics", "worldnews", "news", "gaming", "videos",
  "gifs", "todayilearned", "science", "IAmA", "explainlikeimfive",
  "tifu", "mildlyinteresting", "aww", "nottheonion", "Showerthoughts",
  "LifeProTips", "teenagers", "unpopularopinion", "AmItheAsshole",
  "relationships", "personalfinance", "legaladvice", "technology",
  "movies", "television", "Music", "books", "food", "Cooking",
  "sports", "nba", "soccer", "nfl", "leagueoflegends", "GlobalOffensive",
  "anime", "manga", "memes", "dankmemes", "wholesomememes",
  "me_irl", "therewasanattempt", "facepalm", "cringe",
]);

async function redditFetch(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Reddit fetch failed: ${res.status} ${url}`);
  }
  return res.json();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type SubredditInfo = {
  memberCount: string;
  description: string;
};

export async function getSubredditInfo(sub: string): Promise<SubredditInfo | null> {
  try {
    const data = (await redditFetch(
      `https://www.reddit.com/r/${sub}/about.json`
    )) as { data: { subscribers?: number; public_description?: string; title?: string } };
    const d = data?.data;
    return {
      memberCount: d?.subscribers ? formatNumber(d.subscribers) : "unknown",
      description: (d?.public_description || d?.title || "").slice(0, 200),
    };
  } catch {
    return null;
  }
}

export async function getTopPostAuthors(sub: string, limit = 25): Promise<string[]> {
  try {
    const data = (await redditFetch(
      `https://www.reddit.com/r/${sub}/top.json?t=month&limit=${limit}`
    )) as { data: { children: { data: { author: string } }[] } };
    const posts = data?.data?.children ?? [];
    const authors = posts
      .map((c) => c.data.author)
      .filter((a) => a && a !== "[deleted]" && a !== "AutoModerator");
    return Array.from(new Set(authors)).slice(0, 12);
  } catch {
    return [];
  }
}

export async function getUserSubreddits(username: string, limit = 50): Promise<string[]> {
  try {
    const data = (await redditFetch(
      `https://www.reddit.com/user/${username}/comments.json?limit=${limit}`
    )) as { data: { children: { data: { subreddit: string } }[] } };
    const comments = data?.data?.children ?? [];
    const counts: Record<string, number> = {};
    for (const c of comments) {
      const s = c.data.subreddit;
      if (s && !NOISE_SUBS.has(s)) {
        counts[s] = (counts[s] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 20);
  } catch {
    return [];
  }
}

/**
 * For a given subreddit, sample top authors and find what other
 * subreddits they frequent. Returns the top allied subreddits
 * with cross-user frequency counts.
 */
export async function getSubredditAudience(
  sub: string,
  primarySubs: string[],
  authorSampleSize = 4
) {
  const [info, authors] = await Promise.all([
    getSubredditInfo(sub),
    getTopPostAuthors(sub, 25),
  ]);

  const sampleAuthors = authors.slice(0, authorSampleSize);
  const alliedCounts: Record<string, number> = {};

  // Sequential with 300ms delay to be respectful of rate limits
  for (const author of sampleAuthors) {
    const userSubs = await getUserSubreddits(author, 50);
    for (const s of userSubs) {
      if (!primarySubs.includes(s) && s !== sub) {
        alliedCounts[s] = (alliedCounts[s] || 0) + 1;
      }
    }
    await sleep(300);
  }

  const sorted = Object.entries(alliedCounts).sort((a, b) => b[1] - a[1]);

  const topAlliedGaming = sorted
    .filter(([s]) => isGamingSub(s))
    .slice(0, 6)
    .map(([s]) => s);

  const topAlliedNonGaming = sorted
    .filter(([s]) => !isGamingSub(s))
    .slice(0, 6)
    .map(([s]) => s);

  return {
    subreddit: sub,
    info,
    sampleUsers: authors.slice(0, 6),
    topAlliedGaming,
    topAlliedNonGaming,
  };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}
