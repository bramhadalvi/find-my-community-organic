"use client";
import { GameData } from "@/app/page";

type Props = {
  gameData: GameData;
  onChange: (patch: Partial<GameData>) => void;
  onNext: () => void;
};

const LINK_PRESETS = ["Steam", "Website", "Twitter/X", "TikTok", "YouTube", "Discord", "Itch.io", "Instagram"];

export default function Step1Links({ gameData, onChange, onNext }: Props) {
  const canContinue = gameData.gameName.trim().length > 0;

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...gameData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ links: newLinks });
  };

  const addLink = () => {
    onChange({ links: [...gameData.links, { label: "", url: "" }] });
  };

  const removeLink = (index: number) => {
    onChange({ links: gameData.links.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Tell us about your game</h2>
        <p className="text-slate-400">Share your game's details and any links. The more context, the better we can match your audience.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Game Name *</label>
          <input
            type="text"
            value={gameData.gameName}
            onChange={(e) => onChange({ gameName: e.target.value })}
            placeholder="e.g. Hollow Knight, Stardew Valley..."
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Brief Description</label>
          <textarea
            value={gameData.gameDescription}
            onChange={(e) => onChange({ gameDescription: e.target.value })}
            placeholder="Describe your game in 2-3 sentences. What's the core loop? What emotion does it evoke?"
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Links & Socials</label>
          <p className="text-xs text-slate-500 mb-3">Add any links we can use to understand your game better</p>
          <div className="space-y-2">
            {gameData.links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  className="w-36 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="">Platform</option>
                  {LINK_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
                  <option value="Other">Other</option>
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                />
                {gameData.links.length > 1 && (
                  <button onClick={() => removeLink(i)} className="px-3 text-slate-500 hover:text-red-400 transition-colors">×</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addLink} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            + Add another link
          </button>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-white transition-all"
      >
        Continue to Genre & Mechanics →
      </button>
    </div>
  );
}
