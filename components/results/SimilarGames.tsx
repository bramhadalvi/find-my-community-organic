import { SimilarGame } from "@/app/page";
import LLMPlaceholder from "./LLMPlaceholder";

type Props = {
  games: SimilarGame[];
  gameName: string;
};

export default function SimilarGames({ games, gameName }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Games similar to{" "}
          <span className="text-indigo-400">{gameName}</span>
        </h2>
        <p className="text-slate-400 text-sm">
          Matched by genre, perspective, and visual style from our game
          database.
        </p>
      </div>

      <div className="space-y-3">
        {games.map((game, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-900/40 px-2 py-0.5 rounded">
                    #{i + 1}
                  </span>
                  <h3 className="font-semibold text-white truncate">
                    {game.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {game.reason}
                </p>
                {game.subreddit && (
                  <div className="mt-2">
                    <a
                      href={`https://reddit.com/r/${game.subreddit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/50 hover:bg-orange-950/70 transition-colors"
                    >
                      r/{game.subreddit} ↗
                    </a>
                  </div>
                )}
              </div>
              {game.steamUrl && (
                <a
                  href={game.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-300 underline whitespace-nowrap shrink-0"
                >
                  Steam ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <LLMPlaceholder
          title="AI Match Analysis"
          description="Connect an LLM API key to get a detailed explanation of why these games match yours, what their audiences have in common, and which is your strongest comparison title."
        />
      </div>
    </div>
  );
}
