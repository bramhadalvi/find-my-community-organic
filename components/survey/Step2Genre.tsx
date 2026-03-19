"use client";
import { GameData } from "@/app/page";

type Props = {
  gameData: GameData;
  onChange: (patch: Partial<GameData>) => void;
  onBack: () => void;
  onNext: () => void;
};

const GENRES = [
  { id: "action", label: "Action", icon: "⚔️" },
  { id: "rpg", label: "RPG", icon: "🧙" },
  { id: "strategy", label: "Strategy", icon: "🧩" },
  { id: "simulation", label: "Simulation", icon: "🏗️" },
  { id: "platformer", label: "Platformer", icon: "🏃" },
  { id: "puzzle", label: "Puzzle", icon: "🔮" },
  { id: "horror", label: "Horror", icon: "👻" },
  { id: "adventure", label: "Adventure", icon: "🗺️" },
  { id: "roguelike", label: "Roguelike", icon: "🎲" },
  { id: "metroidvania", label: "Metroidvania", icon: "🗝️" },
  { id: "survival", label: "Survival", icon: "🌿" },
  { id: "sandbox", label: "Sandbox", icon: "🏖️" },
  { id: "narrative", label: "Narrative / Visual Novel", icon: "📖" },
  { id: "tower-defense", label: "Tower Defense", icon: "🏰" },
  { id: "fighting", label: "Fighting", icon: "🥊" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "cozy", label: "Cozy / Relaxing", icon: "☕" },
  { id: "shooter", label: "Shooter", icon: "🔫" },
];

export default function Step2Genre({ gameData, onChange, onBack, onNext }: Props) {
  const toggleGenre = (id: string) => {
    const has = gameData.genres.includes(id);
    onChange({
      genres: has
        ? gameData.genres.filter((g) => g !== id)
        : [...gameData.genres, id],
    });
  };

  const canContinue =
    gameData.genres.length > 0 && gameData.uniqueFeature.trim().length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Genre & Mechanics</h2>
        <p className="text-slate-400">
          Select all genres that apply. Multi-genre games are great — be specific.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Genres{" "}
          <span className="text-slate-500">(select all that apply) *</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GENRES.map((g) => {
            const selected = gameData.genres.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                  selected
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
        {gameData.genres.length > 0 && (
          <p className="mt-2 text-xs text-indigo-400">
            {gameData.genres.length} genre{gameData.genres.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          What makes your game stand out? *
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Describe your core mechanics, unique systems, or what feeling you want
          players to have.
        </p>
        <textarea
          value={gameData.uniqueFeature}
          onChange={(e) => onChange({ uniqueFeature: e.target.value })}
          placeholder={`e.g. "A deck-building roguelike where you play as a chef — each run you discover new recipes that change your strategy completely. The core loop is about risk vs reward in combining ingredients..."`}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-white transition-all"
        >
          Continue to Art Style →
        </button>
      </div>
    </div>
  );
}
