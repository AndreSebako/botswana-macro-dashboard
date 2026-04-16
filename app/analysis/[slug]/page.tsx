import { notFound } from "next/navigation";
import Link from "next/link";
import { analysisProjects } from "@/lib/analysis-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AnalysisDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = analysisProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/analysis"
        className="text-sm text-slate-400 transition hover:text-slate-200"
      >
        ← Back to analysis
      </Link>

      <div className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-400">
        {project.date}
      </div>

      <h1 className="mt-3 text-4xl font-semibold text-white">
        {project.title}
      </h1>

      <p className="mt-4 text-lg leading-8 text-slate-300">
        {project.summary}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <article className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="space-y-6 text-base leading-8 text-slate-200">
          {project.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}