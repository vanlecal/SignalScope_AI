import { useEffect, useState } from "react";
import { fetchLiveNews } from "@/lib/api";
import type { NewsItem } from "@/lib/mock-data";

const CATEGORIES = ["Macro", "Tech", "Energy"];

export default function Landing(): JSX.Element {
  const [news, setNews] = useState<Record<string, NewsItem[]>>(() =>
    CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: [] }), {} as Record<string, NewsItem[]>),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map((c) =>
            fetchLiveNews(c)
              .then((r) => r.slice(0, 4))
              .catch(() => []),
          ),
        );

        if (!mounted) return;

        const map: Record<string, NewsItem[]> = {};
        CATEGORIES.forEach((c, i) => {
          map[c] = results[i] ?? [];
        });

        setNews(map);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="rounded-3xl border border-border/60 glass p-8 mb-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold">SignalScope AI</h1>
          <p className="mt-3 text-muted-foreground max-w-prose">
            Get fast impact analysis on how current news and events will influence markets.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                const w = window.open("/terminal", "_blank");
                if (w) w.opener = null;
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-electric to-ai px-4 py-2 text-white"
            >
              Go to Intelligent Terminal
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground">
              View Demo Animation
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{cat}</h2>
              <div className="text-sm text-muted-foreground">Top 4</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(news[cat] ?? []).length === 0 && !loading ? (
                <div className="col-span-full text-sm text-muted-foreground">No items found.</div>
              ) : (
                (news[cat] ?? []).map((it) => (
                  <article
                    key={it.id}
                    className="bg-surface rounded-xl border border-border/60 overflow-hidden"
                  >
                    {it.image ? (
                      <img src={it.image} alt={it.headline} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-background/40 grid place-items-center text-muted-foreground">
                        No image
                      </div>
                    )}

                    <div className="p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{it.source}</span>
                        <time>{it.time}</time>
                      </div>
                      <a
                        href={it.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-foreground hover:underline"
                      >
                        {it.headline}
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
