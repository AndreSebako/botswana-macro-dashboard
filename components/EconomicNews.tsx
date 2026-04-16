import Link from "next/link";
import { newsItems } from "@/lib/news-data";

export function EconomicNews() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-3xl font-semibold text-white">Economic news</h2>

      <div className="mt-6 space-y-6">
        {newsItems.map((item) =>
          item.external ? (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="text-lg font-medium text-white">{item.title}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{item.summary}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  {item.source}
                </div>
                <div className="text-sm text-blue-300">Open →</div>
              </div>
            </a>
          ) : (
            <Link
              key={item.title}
              href={item.href}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="text-lg font-medium text-white">{item.title}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{item.summary}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  {item.source}
                </div>
                <div className="text-sm text-blue-300">Open →</div>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}