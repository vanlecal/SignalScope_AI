import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { deriveDashboardMetrics, fetchLiveNews } from "@/lib/api";
import { SIGNALSCOPE_LOGO } from "@/lib/branding";
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

const EMPTY_CATEGORIES_LOADING = CATEGORIES.reduce(
  (acc, category) => ({ ...acc, [category]: false }),
  {} as Record<string, boolean>,
);

const LOOP_VIDEO =
  "https://gif.guru/file/aHR0cHM6Ly9taXJvLm1lZGl1bS5jb20vbWF4LzEyNDAvMSpTUm9CcF9XUmh6SHY1N3J1UjVJVTBBLmdpZg.mp4";

export default function Landing() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(FALLBACK_METRICS);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [news, setNews] = useState<Record<string, NewsItem[]>>(EMPTY_NEWS);
  const [categoryLoading, setCategoryLoading] = useState(EMPTY_CATEGORIES_LOADING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const allItems = await fetchLiveNews("All");

        if (!mounted) return;

        setMetrics(allItems.length > 0 ? deriveDashboardMetrics(allItems) : FALLBACK_METRICS);
        setItems(allItems);
        setNews(groupItemsByCategory(allItems));
      } catch {
        if (mounted) {
          setMetrics(FALLBACK_METRICS);
          setItems([]);
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

  useEffect(() => {
    let mounted = true;

    if (loading) {
      return () => {
        mounted = false;
      };
    }

    const handle = window.setTimeout(() => {
      CATEGORIES.forEach((category) => {
        setCategoryLoading((current) => ({ ...current, [category]: true }));

        fetchLiveNews(category)
          .then((categoryItems) => {
            if (!mounted) return;

            setNews((current) => ({
              ...current,
              [category]: categoryItems.slice(0, 4),
            }));
          })
          .catch(() => {
            if (!mounted) return;

            setNews((current) => ({
              ...current,
              [category]: current[category] ?? [],
            }));
          })
          .finally(() => {
            if (!mounted) return;

            setCategoryLoading((current) => ({ ...current, [category]: false }));
          });
      });
    }, 0);

    return () => {
      mounted = false;
      window.clearTimeout(handle);
    };
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 space-y-12">
        <Hero metrics={metrics} title="SignalScope AI" terminalHref="/terminal" />

        {/* Companion card: live-loop GIF matching Hero visual style */}
        <section className="mt-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 glass">
            <div className="absolute inset-0 grid-bg opacity-40" />

            <div className="relative p-4 md:p-6 lg:p-8">
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <div className="w-full h-48 lg:h-64 overflow-hidden rounded-xl bg-background/10">
                  <video
                    className="w-full h-full object-cover"
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    poster={SIGNALSCOPE_LOGO}
                    aria-label="SignalScope live news preview"
                  >
                    <source src={LOOP_VIDEO} type="video/mp4" />
                    {/* Fallback image if video is unsupported */}
                    <img src={SIGNALSCOPE_LOGO} alt="SignalScope preview" />
                  </video>
                </div>

                <div className="space-y-3 max-w-xl">
                  <h3 className="text-2xl font-semibold">Live News Snapshot</h3>
                  <p className="text-sm text-muted-foreground">
                    {" "}
                    to convey oped overview of market-moving headlines and statistics to convey
                    SignalScope AI's live monitoring concept.
                  </p>

                  <div>
                    <a
                      href="/terminal"
                      className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-electric to-ai text-white text-sm"
                    >
                      Open Live Monitor
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <div className="text-sm text-muted-foreground">Top 4</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryLoading[category] && (news[category] ?? []).length === 0 ? (
                  <div className="col-span-full text-sm text-muted-foreground">
                    Loading category feed...
                  </div>
                ) : (news[category] ?? []).length === 0 && !loading ? (
                  <div className="col-span-full text-sm text-muted-foreground">No items found.</div>
                ) : (
                  (news[category] ?? []).map((item) => (
                    <article
                      key={item.id}
                      className="content-auto bg-surface rounded-xl border border-border/60 overflow-hidden"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.headline}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-36 relative overflow-hidden bg-background/40">
                          <div className="absolute inset-0 grid-bg opacity-40" />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(circle at 30% 30%, rgba(0, 192, 255, 0.18), transparent 60%)",
                            }}
                          />
                          <img
                            src={SIGNALSCOPE_LOGO}
                            alt="SignalScope AI logo"
                            className="absolute inset-0 h-full w-full object-contain p-8"
                          />
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
      <Footer />
    </div>
  );
}

function groupItemsByCategory(items: NewsItem[]): Record<string, NewsItem[]> {
  return CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = items.filter((item) => item.category === category).slice(0, 4);
      return acc;
    },
    {} as Record<string, NewsItem[]>,
  );
}
