type Tone = "positive" | "negative" | "neutral";

type StatCardProps = {
  title: string;
  value: string;
  source: string;
  footnote: string;
  tone?: Tone;
  changeText?: string;
};

function getToneClasses(tone: Tone) {
  switch (tone) {
    case "positive":
      return {
        value: "text-green-400",
        footnote: "text-green-300",
      };
    case "negative":
      return {
        value: "text-red-400",
        footnote: "text-red-300",
      };
    default:
      return {
        value: "text-white",
        footnote: "text-slate-300",
      };
  }
}

export function StatCard({
  title,
  value,
  source,
  footnote,
  tone = "neutral",
  changeText,
}: StatCardProps) {
  const classes = getToneClasses(tone);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-slate-400">{title}</div>
      <div className={`mt-3 text-5xl font-semibold ${classes.value}`}>{value}</div>
      <div className="mt-3 text-sm uppercase tracking-wide text-slate-500">{source}</div>
      <div className={`mt-4 text-base ${classes.footnote}`}>{footnote}</div>
      {changeText ? <div className={`mt-2 text-sm ${classes.footnote}`}>{changeText}</div> : null}
    </div>
  );
}