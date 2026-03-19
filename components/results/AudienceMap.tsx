import { AudienceInsight } from "@/app/page";
import LLMPlaceholder from "./LLMPlaceholder";

type Props = {
  insights: AudienceInsight[];
  gameName: string;
};

export default function AudienceMap({ insights, gameName }: Props) {
  return (
    <div>
      <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
        <h2 className="text-2xl font-bold text-white mb-1">
          Core Audience Map
        </h2>
        <p className="text-slate-300 text-sm">
          Real Reddit data showing where{" "}
          <span className="text-indigo-400 font-medium">{gameName}</span>'s
          ideal first 100–500 players currently hang out and what else they
          engage with.
        </p>
      </div>

      <div className="space-y-6">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden"
          >
            {/* Community header */}
            <div className="px-5 py-4 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <a
                      href={`https://reddit.com/r/${insight.subreddit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 font-bold text-lg hover:text-orange-300 transition-colors"
                    >
                      r/{insight.subreddit}
                    </a>
                    {insight.memberCount && insight.memberCount !== "unknown" && (
                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                        {insight.memberCount} members
                      </span>
                    )}
                  </div>
                  {insight.description && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {insight.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Gaming communities */}
            {insight.topAlliedGaming.length > 0 && (
              <div className="px-5 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Other gaming communities these fans frequent
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.topAlliedGaming.map((allied, j) => (
                    <a
                      key={j}
                      href={`https://reddit.com/r/${allied.subreddit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/60 hover:border-indigo-700 transition-all text-xs font-medium text-indigo-300 hover:text-indigo-200"
                    >
                      r/{allied.subreddit}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Adjacent non-gaming interests */}
            {insight.topAlliedNonGaming.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Adjacent interests outside gaming
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Alternate paths to reach the same audience where games aren't the topic
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.topAlliedNonGaming.map((allied, j) => (
                    <a
                      key={j}
                      href={`https://reddit.com/r/${allied.subreddit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 hover:border-emerald-700 transition-all text-xs font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      r/{allied.subreddit}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* LLM placeholder for audience profile */}
            <div className="px-5 pb-4">
              <LLMPlaceholder
                title="Audience Profile Summary"
                description="Connect an LLM API key to get a written profile of who these players are, what content they respond to, and how to approach them authentically."
              />
            </div>

            {/* Sample users */}
            {insight.sampleUsers && insight.sampleUsers.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-900/30">
                <p className="text-xs text-slate-500 mb-2">
                  Active community members — consider engaging or sending early
                  access
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.sampleUsers.map((user, j) => (
                    <a
                      key={j}
                      href={`https://reddit.com/u/${user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 bg-blue-950/30 px-2 py-0.5 rounded transition-colors"
                    >
                      u/{user}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Marketing strategy tips */}
      <div className="mt-6 p-5 rounded-xl bg-slate-800/40 border border-slate-700">
        <h3 className="font-semibold text-white mb-3">
          Where to post for organic growth
        </h3>
        <ul className="space-y-2.5 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="text-indigo-400 shrink-0">→</span>
            <span>
              Post genuine devlogs and progress updates in the primary
              subreddits above.{" "}
              <strong className="text-slate-300">No ads — only value.</strong>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400 shrink-0">→</span>
            <span>
              Engage in the allied interest communities as a regular member for
              2–4 weeks before mentioning your game.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400 shrink-0">→</span>
            <span>
              DM active users who comment positively on similar games — offer
              early access or alpha keys.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400 shrink-0">→</span>
            <span>
              Use the subreddit overlaps to find where your exact audience
              clusters. Cross-post strategically.
            </span>
          </li>
        </ul>

        <div className="mt-4">
          <LLMPlaceholder
            title="Personalized Marketing Strategy"
            description="Connect an LLM API key to get a custom 30-day outreach plan tailored to your specific game, audience profile, and subreddit data above."
          />
        </div>
      </div>
    </div>
  );
}
