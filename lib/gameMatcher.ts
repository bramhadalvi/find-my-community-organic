import gamesData from "@/data/games.json";

export type GameEntry = {
  name: string;
  genres: string[];
  perspective: string;
  visualStyle: string;
  tags: string[];
  subreddit: string;
  steamUrl?: string;
};

export type SimilarGame = {
  name: string;
  reason: string;
  score: number;
  subreddit: string;
  steamUrl?: string;
};

type GameInput = {
  genres: string[];
  perspective: string;
  visualStyle: string;
};

function scoreGame(input: GameInput, game: GameEntry): number {
  let score = 0;

  // Genre overlaps: 3 points each
  const genreOverlaps = input.genres.filter((g) => game.genres.includes(g));
  score += genreOverlaps.length * 3;

  // Perspective match: 2 points
  if (input.perspective && game.perspective === input.perspective) {
    score += 2;
  }

  // Visual style match: 2 points
  if (input.visualStyle && game.visualStyle === input.visualStyle) {
    score += 2;
  }

  return score;
}

function buildReason(input: GameInput, game: GameEntry): string {
  const parts: string[] = [];

  const genreOverlaps = input.genres.filter((g) => game.genres.includes(g));
  if (genreOverlaps.length > 0) {
    parts.push(`genre: ${genreOverlaps.join(", ")}`);
  }

  if (input.perspective && game.perspective === input.perspective) {
    const perspectiveLabels: Record<string, string> = {
      "2d-side": "2D side-scroller",
      "2d-top": "2D top-down",
      isometric: "isometric perspective",
      "3d-first": "first-person 3D",
      "3d-third": "third-person 3D",
      vr: "VR",
    };
    parts.push(`perspective: ${perspectiveLabels[input.perspective] ?? input.perspective}`);
  }

  if (input.visualStyle && game.visualStyle === input.visualStyle) {
    const styleLabels: Record<string, string> = {
      pixel: "pixel art",
      "hand-drawn": "hand-drawn art",
      minimalist: "minimalist style",
      realistic: "realistic visuals",
      "low-poly": "low poly 3D",
      anime: "anime aesthetic",
      cartoon: "cartoon style",
      "dark-gritty": "dark & gritty visuals",
      watercolor: "watercolor art",
      vector: "vector / flat design",
    };
    parts.push(`art: ${styleLabels[input.visualStyle] ?? input.visualStyle}`);
  }

  if (parts.length === 0) {
    return `Popular reference game in the indie space`;
  }

  return `Shares ${parts.join(" · ")}`;
}

export function findSimilarGames(input: GameInput, topN = 7): SimilarGame[] {
  const games = gamesData as GameEntry[];

  const scored = games
    .map((game) => ({
      game,
      score: scoreGame(input, game),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tiebreak: most genre overlaps
      const aGenres = input.genres.filter((g) => a.game.genres.includes(g)).length;
      const bGenres = input.genres.filter((g) => b.game.genres.includes(g)).length;
      return bGenres - aGenres;
    })
    .slice(0, topN);

  return scored.map(({ game, score }) => ({
    name: game.name,
    reason: buildReason(input, game),
    score,
    subreddit: game.subreddit,
    steamUrl: game.steamUrl,
  }));
}
