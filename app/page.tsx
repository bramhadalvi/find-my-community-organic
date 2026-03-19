"use client";
import { useState } from "react";
import Step1Links from "@/components/survey/Step1Links";
import Step2Genre from "@/components/survey/Step2Genre";
import Step3ArtStyle from "@/components/survey/Step3ArtStyle";
import SimilarGames from "@/components/results/SimilarGames";
import AudienceMap from "@/components/results/AudienceMap";

export type GameData = {
  // Step 1
  gameName: string;
  gameDescription: string;
  links: { label: string; url: string }[];
  // Step 2
  genres: string[];
  uniqueFeature: string;
  // Step 3
  perspective: string;
  visualStyle: string;
  artDescription: string;
};

export type SimilarGame = {
  name: string;
  reason: string;
  score: number;
  subreddit: string;
  steamUrl?: string;
};

export type AudienceInsight = {
  subreddit: string;
  description: string;
  memberCount?: string;
  topAlliedGaming: { subreddit: string }[];
  topAlliedNonGaming: { subreddit: string }[];
  sampleUsers: string[];
};

const STEPS = ["Your Game", "Genre & Mechanics", "Art Style", "Results"];

const emptyGameData: GameData = {
  gameName: "",
  gameDescription: "",
  links: [{ label: "Steam", url: "" }, { label: "Website", url: "" }, { label: "Twitter/X", url: "" }],
  genres: [],
  uniqueFeature: "",
  perspective: "",
  visualStyle: "",
  artDescription: "",
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [gameData, setGameData] = useState<GameData>(emptyGameData);
  const [similarGames, setSimilarGames] = useState<SimilarGame[]>([]);
  const [audienceData, setAudienceData] = useState<AudienceInsight[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [findingAudience, setFindingAudience] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGameData = (patch: Partial<GameData>) =>
    setGameData((prev) => ({ ...prev, ...patch }));

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/match-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSimilarGames(data.similarGames);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFindAudience = async () => {
    setFindingAudience(true);
    setError(null);
    try {
      const res = await fetch("/api/find-audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ similarGames, gameData }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAudienceData(data.insights);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Audience search failed");
    } finally {
      setFindingAudience(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-400 tracking-tight">FindMyCommunity</h1>
            <p className="text-xs text-slate-500">Organic audience discovery for indie games</p>
          </div>
          {step < 3 && (
            <div className="flex items-center gap-2">
              {STEPS.slice(0, 3).map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 ${i <= step ? "text-indigo-400" : "text-slate-600"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${i < step ? "bg-indigo-600 border-indigo-600 text-white" : i === step ? "border-indigo-400 text-indigo-400" : "border-slate-700 text-slate-600"}`}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span className="text-xs hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && <div className={`w-8 h-px ${i < step ? "bg-indigo-600" : "bg-slate-700"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          {step === 0 && (
            <Step1Links
              gameData={gameData}
              onChange={updateGameData}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <Step2Genre
              gameData={gameData}
              onChange={updateGameData}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step3ArtStyle
              gameData={gameData}
              onChange={updateGameData}
              onBack={() => setStep(1)}
              onSubmit={handleAnalyze}
              analyzing={analyzing}
            />
          )}

          {step === 3 && (
            <div className="space-y-8">
              <SimilarGames games={similarGames} gameName={gameData.gameName} />

              {audienceData.length === 0 && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleFindAudience}
                    disabled={findingAudience}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/50 disabled:cursor-not-allowed"
                  >
                    {findingAudience ? (
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mapping your audience...
                      </span>
                    ) : (
                      "Find where my core audience is →"
                    )}
                  </button>
                  <p className="mt-3 text-sm text-slate-500">
                    We'll scan Reddit communities to find your 100–500 initial players
                  </p>
                </div>
              )}

              {audienceData.length > 0 && (
                <AudienceMap insights={audienceData} gameName={gameData.gameName} />
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => { setStep(0); setGameData(emptyGameData); setSimilarGames([]); setAudienceData([]); }}
                  className="text-sm text-slate-500 hover:text-slate-300 underline underline-offset-2"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
