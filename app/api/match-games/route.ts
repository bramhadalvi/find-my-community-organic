import { NextRequest, NextResponse } from "next/server";
import { findSimilarGames } from "@/lib/gameMatcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { genres, perspective, visualStyle } = body;

    if (!genres || !Array.isArray(genres)) {
      return NextResponse.json({ error: "genres array is required" }, { status: 400 });
    }

    const similarGames = findSimilarGames({ genres, perspective, visualStyle });

    return NextResponse.json({ similarGames });
  } catch (e: unknown) {
    console.error("match-games error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Matching failed" },
      { status: 500 }
    );
  }
}
