import Link from "next/link";
import { analysisProjects } from "@/lib/analysis-data";

export default function AnalysisPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-4xl">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Analysis
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Botswana economy analysis
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          This page is for deeper project-based analysis of Botswana’s macroeconomy.
          Use it to publish written research, policy commentary, sector notes, and
          dashboard-backed macro interpretations.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
        <div className="text-sm uppercase tracking-[0.15em] text-slate-400">
          Research library
        </div>
        <p className="mt-3 leading-7">
          Click any project below to open the full analysis page.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {analysisProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/analysis/${project.slug}`}
            className="block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="text-sm uppercase tracking-[0.12em] text-slate-400">
              {project.date}
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              {project.title}
            </h2>

            <p className="mt-4 leading-7 text-slate-300">{project.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 text-sm font-medium text-blue-300">
              Open analysis →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}