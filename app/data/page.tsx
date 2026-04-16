import snapshot from "@/data/processed/botswana/latest_snapshot.json";

export default function DataPage() {
  const series = Object.values(snapshot).filter(
    (item: any) => item && typeof item === "object" && "slug" in item
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">Data library</h1>

      <div className="mt-6 space-y-4">
        {series.map((item: any) => (
          <div
            key={item.slug}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="text-white font-medium">{item.title}</div>
            <div className="text-sm text-slate-400">Source: {item.source}</div>
            <div className="text-sm text-slate-400">
              Last updated: {item.latest_date ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}