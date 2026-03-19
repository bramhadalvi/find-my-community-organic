import { NextRequest, NextResponse } from "next/server";
import { getSubredditAudience } from "@/lib/reddit";

type SimilarGame = {
  name: string;
  subreddit: string;
};

type RequestBody = {
  similarGames: SimilarGame[];
};

export async function POST(req: NextRequest) {
  try {
    const { similarGames }: RequestBody = await req.json();

    const subreddits = Array.from(
      new Set(
        similarGames
          .map((g) => g.subreddit)
          .filter((s): s is string => Boolean(s))
      )
    ).slice(0, 4); // cap at 4 to keep response time reasonable

    if (subreddits.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    // Process subreddits sequentially to respect Reddit rate limits
    const insights = [];
    for (const sub of subreddits) {
      const result = await getSubredditAudience(sub, subreddits);
      insights.push({
        subreddit: result.subreddit,
        memberCount: result.info?.memberCount ?? "unknown",
        description: result.info?.description ?? "",
        topAlliedGaming: result.topAlliedGaming.map((s) => ({ subreddit: s })),
        topAlliedNonGaming: result.topAlliedNonGaming.map((s) => ({ subreddit: s })),
        sampleUsers: result.sampleUsers,
      });
    }

    return NextResponse.json({ insights });
  } catch (e: unknown) {
    console.error("find-audience error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Audience search failed" },
      { status: 500 }
    );
  }
}
