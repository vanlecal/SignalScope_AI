import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { MarketCards } from "@/components/MarketCards";
import { NewsFeed } from "@/components/NewsFeed";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import type { NewsItem } from "@/lib/mock-data";

export default function App() {
  const [selected, setSelected] = useState<NewsItem | null>(null);

  return (
    <div className="dark min-h-screen text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
            <section id="overview" className="scroll-mt-24">
              <Hero />
            </section>

            <section id="trends" className="scroll-mt-24 space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Market pulse
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">Trend overview</h2>
                </div>
              </div>
              <MarketCards />
            </section>

            <section id="feed" className="scroll-mt-24 space-y-4">
              <NewsFeed onSelect={setSelected} selectedId={selected?.id} />
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
      <AnalysisPanel item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
