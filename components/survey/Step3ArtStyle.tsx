"use client";
import { GameData } from "@/app/page";

type Props = {
  gameData: GameData;
  onChange: (patch: Partial<GameData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  analyzing: boolean;
};

const PERSPECTIVES = [
  { id: "2d-side", label: "2D Side-Scroller", icon: "◀▶" },
  { id: "2d-top", label: "2D Top-Down", icon: "⬆" },
  { id: "isometric", label: "Isometric", icon: "◇" },
  { id: "3d-first", label: "3D First-Person", icon: "👁" },
  { id: "3d-third", label: "3D Third-Person", icon: "🎮" },
  { id: "vr", label: "VR", icon: "🥽" },
];

const VISUAL_STYLES = [
  { id: "pixel", label: "Pixel Art", desc: "Retro / lo-fi pixels" },
  { id: "hand-drawn", label: "Hand-Drawn", desc: "Painterly or sketch style" },
  { id: "minimalist", label: "Minimalist", desc: "Clean shapes, limited palette" },
  { id: "realistic", label: "Realistic", desc: "High fidelity / photorealistic" },
  { id: "low-poly", label: "Low Poly", desc: "Geometric 3D facets" },
  { id: "anime", label: "Anime / Manga", desc: "Japanese animation aesthetic" },
  { id: "cartoon", label: "Cartoon", desc: "Stylized, bold outlines" },
  { id: "dark-gritty", label: "Dark & Gritty", desc: "Moody, atmospheric" },
  { id: "watercolor", label: "Watercolor", desc: "Soft, painted look" },
  { id: "vector", label: "Vector / Flat", desc: "Crisp flat design" },
];

export default function Step3ArtStyle({
  gameData,
  onChange,
  onBack,
  onSubmit,
  analyzing,
}: Props) {
  const canSubmit = gameData.perspective && gameData.visualStyle;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Art Style</h2>
        <p className="text-slate-400">
          Help us understand the visual identity of your game.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Perspective / Camera *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PERSPECTIVES.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange({ perspective: p.id })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                gameData.perspective === p.id
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="text-base">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Visual Style *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLES.map((v) => (
            <button
              key={v.id}
              onClick={() => onChange({ visualStyle: v.id })}
              className={`text-left px-4 py-3 rounded-lg border transition-all ${
                gameData.visualStyle === v.id
                  ? "bg-indigo-600/20 border-indigo-500"
                  : "bg-slate-800 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  gameData.visualStyle === v.id
                    ? "text-indigo-300"
                    : "text-slate-300"
                }`}
              >
                {v.label}
              </div>
              <div className="text-xs text-slate-500">{v.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Describe your visual aesthetic{" "}
          <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          value={gameData.artDescription}
          onChange={(e) => onChange({ artDescription: e.target.value })}
          placeholder={`e.g. "Dark gothic pixel art with a warm amber palette — think Castlevania meets Disco Elysium in terms of mood..."`}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={analyzing}
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || analyzing}
          className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-white transition-all"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Finding similar games...
            </span>
          ) : (
            "Find Similar Games →"
          )}
        </button>
      </div>
    </div>
  );
}
