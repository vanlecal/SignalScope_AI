import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { MarketCards } from "@/components/MarketCards";
import { NewsFeed } from "@/components/NewsFeed";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import type { NewsItem } from "@/lib/mock-data";
import {
  applyAnalysisToItem,
  analyzeEvent,
  deriveDashboardMetrics,
  fetchLiveNews,
} from "@/lib/api";

export default function App() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const metrics = deriveDashboardMetrics(items);

  useEffect(() => {
    let mounted = true;

    const loadFeed = async () => {
      try {
        setFeedLoading(true);
        setFeedError(null);

        const liveItems = await fetchLiveNews();

        if (!mounted) {
          return;
        }

        setItems(liveItems);
        setSelected((current) => current ?? liveItems[0] ?? null);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setFeedError(error instanceof Error ? error.message : "Failed to load live news.");
        setItems([]);
      } finally {
        if (mounted) {
          setFeedLoading(false);
        }
      }
    };

    void loadFeed();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selected?.headline) {
      return;
    }

    let mounted = true;

    const loadAnalysis = async () => {
      try {
        setAnalysisLoading(true);
        setAnalysisError(null);

        const analysis = await analyzeEvent(selected.headline);

        if (!mounted) {
          return;
        }

        const merged = applyAnalysisToItem(selected, analysis);
        setSelected(merged);
        setItems((current) => current.map((item) => (item.id === merged.id ? merged : item)));
      } catch (error) {
        if (mounted) {
          setAnalysisError(error instanceof Error ? error.message : "Failed to load analysis.");
        }
      } finally {
        if (mounted) {
          setAnalysisLoading(false);
        }
      }
    };

    void loadAnalysis();

    return () => {
      mounted = false;
    };
  }, [selected?.headline, selected?.id]);

  return (
    <div className="dark min-h-screen text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
            <section id="overview" className="scroll-mt-24">
              <Hero metrics={metrics} />
            </section>

            <section id="trends" className="scroll-mt-24 space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Market pulse
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">{metrics.headline}</h2>
                </div>
              </div>
              <MarketCards cards={metrics.cards} />
            </section>

            <section id="feed" className="scroll-mt-24 space-y-4">
              <NewsFeed
                items={items}
                onSelect={setSelected}
                selectedId={selected?.id}
                loading={feedLoading}
                error={feedError}
              />
            </section>

            <section
              id="analysis"
              className="scroll-mt-24 rounded-3xl border border-border/60 glass p-6 md:p-8"
            >
              <div className="max-w-3xl space-y-3">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-ai">AI insights</p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Open any headline to inspect sector impact, company exposure, and trade ideas.
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  The analysis drawer turns each item into a structured brief so the interface stays
                  fast, readable, and fully client-side in a standard Vite React setup.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
      <AnalysisPanel
        item={selected}
        onClose={() => setSelected(null)}
        loading={analysisLoading}
        error={analysisError}
      />
    </div>
  );
}
