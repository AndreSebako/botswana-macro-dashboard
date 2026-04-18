type NewsItem = {
  title: string;
  summary: string;
  source: string;
  href: string;
  publishedAt?: string;
  category: "Botswana" | "IMF" | "Regional" | "Global";
};

type NewsResponse = {
  updatedAt: string;
  botswana: NewsItem[];
  imf: NewsItem[];
  imfAvailable: boolean;
  error?: string;
};

async function getNews(): Promise<NewsResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/news`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      updatedAt: new Date().toISOString(),
      botswana: [],
      imf: [],
      imfAvailable: false,
      error: "Failed to load news.",
    };
  }

  return res.json();
}

function NewsBlock({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: NewsItem[];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
          {items.length} items
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            {emptyMessage}
          </div>
        ) : null}

        {items.map((item) => (
          <a
            key={`${item.source}-${item.href}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                {item.category}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                {item.source}
              </span>
              {item.publishedAt ? (
                <span className="text-xs text-slate-500">
                  {new Date(item.publishedAt).toLocaleDateString("en-BW", {
                    timeZone: "Africa/Gaborone",
                  })}
                </span>
              ) : null}
            </div>

            <div className="mt-3 text-lg font-medium leading-8 text-white">
              {item.title}
            </div>

            <div className="mt-2 text-sm leading-7 text-slate-300">
              {item.summary || "Open for full details."}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export async function LiveEconomicNews() {
  const data = await getNews();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-semibold text-white">Economic news</h2>
        <span className="text-sm text-slate-400">
          Updated{" "}
          {new Date(data.updatedAt).toLocaleString("en-BW", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Africa/Gaborone",
          })}{" "}
          CAT
        </span>
      </div>

      {data.error ? (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {data.error}
        </div>
      ) : null}

      {!data.imfAvailable ? (
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          IMF feed is temporarily unavailable. Botswana headlines are still live.
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <NewsBlock
          title="Botswana market and economy"
          items={data.botswana}
          emptyMessage="No Botswana headlines available right now."
        />

        <NewsBlock
          title="IMF and institutional watch"
          items={data.imf}
          emptyMessage="No IMF items available right now."
        />
      </div>
    </section>
  );
}