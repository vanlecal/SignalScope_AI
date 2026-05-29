import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { deriveDashboardMetrics, fetchLiveNews } from "@/lib/api";
import type { DashboardMetrics } from "@/lib/api";
import type { NewsItem } from "@/lib/mock-data";

const CATEGORIES = ["Macro", "Tech", "Energy"];

const FALLBACK_METRICS: DashboardMetrics = {
  headline: "Live Market Intelligence",
  description: "Waiting for live headlines to populate the market summary.",
  cards: [],
  tickers: [
    { sym: "LIVE", val: "0", chg: "Idle", up: false },
    { sym: "SOURCES", val: "0", chg: "None", up: false },
    { sym: "BULLISH", val: "0%", chg: "+0", up: false },
    { sym: "BEARISH", val: "0%", chg: "-0", up: false },
    { sym: "TOP", val: "Live feed", chg: "Market overview", up: true },
    { sym: "MIX", val: "0/0", chg: "0% neutral", up: false },
  ],
  liveCount: 0,
  sourceCount: 0,
  keywords: [],
};

const EMPTY_NEWS = CATEGORIES.reduce(
  (acc, category) => ({ ...acc, [category]: [] }),
  {} as Record<string, NewsItem[]>,
);

export default function Landing() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(FALLBACK_METRICS);
  const [news, setNews] = useState<Record<string, NewsItem[]>>(EMPTY_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const [allItems, categoryBatches] = await Promise.all([
          fetchLiveNews("All"),
          Promise.all(
            CATEGORIES.map((category) =>
              fetchLiveNews(category)
                .then((items) => items.slice(0, 4))
                .catch(() => []),
            ),
          ),
        ]);

        if (!mounted) return;

        setMetrics(allItems.length > 0 ? deriveDashboardMetrics(allItems) : FALLBACK_METRICS);

        const nextNews: Record<string, NewsItem[]> = {};
        CATEGORIES.forEach((category, index) => {
          nextNews[category] = categoryBatches[index] ?? [];
        });

        setNews(nextNews);
      } catch {
        if (mounted) {
          setMetrics(FALLBACK_METRICS);
          setNews(EMPTY_NEWS);
        }
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
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <Hero metrics={metrics} title="SignalScope AI" />

      <section className="space-y-12">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="text-sm text-muted-foreground">Top 4</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(news[category] ?? []).length === 0 && !loading ? (
                <div className="col-span-full text-sm text-muted-foreground">No items found.</div>
              ) : (
                (news[category] ?? []).map((item) => (
                  <article
                    key={item.id}
                    className="bg-surface rounded-xl border border-border/60 overflow-hidden"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.headline}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-background/40 grid place-items-center text-muted-foreground">
                        No image
                      </div>
                    )}

                    <div className="p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{item.source}</span>
                        <time>{item.time}</time>
                      </div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-foreground hover:underline"
                      >
                        {item.headline}
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
