// Client-side Reddit fetching — runs in the browser, bypasses server IP blocks.
// Reddit's public JSON API supports CORS and allows browser requests.

const GAMING_PATTERN = /game|gaming|gamer|rpg|indie|steam|playstation|xbox|nintendo|pixel|retro|roguelike|metroidvania|zelda|pokemon|mario|sonic|minecraft|fortnite|valorant|pcgaming|fps|mmo|jrpg|arpg|shooter|strategy|survival|puzzle|platformer|adventure|vr|esport/i;

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

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function redditGet(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reddit ${res.status} ${url}`);
  return res.json();
}

async function getSubredditInfo(sub: string) {
  try {
    const data = (await redditGet(
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

async function getTopPostAuthors(sub: string): Promise<string[]> {
  try {
    const data = (await redditGet(
      `https://www.reddit.com/r/${sub}/top.json?t=month&limit=25`
    )) as { data: { children: { data: { author: string } }[] } };
    const authors = (data?.data?.children ?? [])
      .map((c) => c.data.author)
      .filter((a) => a && a !== "[deleted]" && a !== "AutoModerator");
    return Array.from(new Set(authors)).slice(0, 12);
  } catch {
    return [];
  }
}

async function getUserSubreddits(username: string): Promise<string[]> {
  try {
    const data = (await redditGet(
      `https://www.reddit.com/user/${username}/comments.json?limit=50`
    )) as { data: { children: { data: { subreddit: string } }[] } };
    const counts: Record<string, number> = {};
    for (const c of data?.data?.children ?? []) {
      const s = c.data.subreddit;
      if (s && !NOISE_SUBS.has(s)) counts[s] = (counts[s] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function fetchSubredditAudience(sub: string, primarySubs: string[]) {
  const [info, authors] = await Promise.all([
    getSubredditInfo(sub),
    getTopPostAuthors(sub),
  ]);

  const sampleAuthors = authors.slice(0, 4);
  const alliedCounts: Record<string, number> = {};

  for (const author of sampleAuthors) {
    const userSubs = await getUserSubreddits(author);
    for (const s of userSubs) {
      if (!primarySubs.includes(s) && s !== sub) {
        alliedCounts[s] = (alliedCounts[s] || 0) + 1;
      }
    }
    await sleep(300);
  }

  const sorted = Object.entries(alliedCounts).sort((a, b) => b[1] - a[1]);

  return {
    subreddit: sub,
    memberCount: info?.memberCount ?? "unknown",
    description: info?.description ?? "",
    sampleUsers: authors.slice(0, 6),
    topAlliedGaming: sorted
      .filter(([s]) => GAMING_PATTERN.test(s))
      .slice(0, 6)
      .map(([s]) => ({ subreddit: s })),
    topAlliedNonGaming: sorted
      .filter(([s]) => !GAMING_PATTERN.test(s))
      .slice(0, 6)
      .map(([s]) => ({ subreddit: s })),
  };
}
