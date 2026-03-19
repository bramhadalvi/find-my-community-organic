type Props = {
  title: string;
  description: string;
};

export default function LLMPlaceholder({ title, description }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/30 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm">
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-slate-300">{title}</p>
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-medium">
              Coming soon
            </span>
          </div>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
