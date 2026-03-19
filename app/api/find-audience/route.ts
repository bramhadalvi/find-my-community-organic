import { NextRequest, NextResponse } from "next/server";

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
    ).slice(0, 4);

    return NextResponse.json({ subreddits });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
