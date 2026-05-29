import { motion } from "framer-motion";
import { ArrowUpRight, Clock, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { SIGNALSCOPE_LOGO } from "@/lib/branding";
import type { NewsItem } from "@/lib/mock-data";

const SEV_DOT = {
  low: "bg-success shadow-[0_0_8px_var(--color-success)]",
  moderate: "bg-warning shadow-[0_0_8px_var(--color-warning)]",
  high: "bg-destructive shadow-[0_0_8px_var(--color-destructive)]",
};

const SENT_ICON = {
  bullish: { Icon: TrendingUp, cls: "text-success bg-success/10 border-success/30" },
  bearish: { Icon: TrendingDown, cls: "text-destructive bg-destructive/10 border-destructive/30" },
  neutral: { Icon: Minus, cls: "text-muted-foreground bg-muted/30 border-border" },
};

export function NewsFeed({
  items,
  onSelect,
  selectedId,
  loading,
  error,
  activeCategory,
  onCategoryChange,
  searchQuery,
  totalItems,
}: {
  items: NewsItem[];
  onSelect: (n: NewsItem) => void;
  selectedId?: string;
  loading?: boolean;
  error?: string | null;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  totalItems: number;
}) {
  const categories = ["All", "Macro", "Tech", "Energy"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live Intelligence Feed
          </h2>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Updated 4s ago · 2,847 sources monitored
          </p>
        </div>
        <div className="flex gap-1 text-xs font-mono">
          {categories.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onCategoryChange(t)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeCategory === t
                  ? "bg-electric/15 text-electric border border-electric/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl border border-border/60 glass animate-pulse" />
          ))}
        </div>
      ) : null}

      {!loading && items.length === 0 ? (
        <div className="rounded-2xl border border-border/60 glass p-6 text-sm text-muted-foreground">
          {searchQuery
            ? `No matches for “${searchQuery}”. Try a different company, ticker, or topic.`
            : "No live headlines available right now."}
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <p className="text-xs font-mono text-muted-foreground">
          Showing {items.length} of {totalItems} headlines
          {searchQuery ? ` · filtered by “${searchQuery}”` : ""}
        </p>
      ) : null}

      <div className="space-y-3">
        {items.map((n, i) => {
          const sent = SENT_ICON[n.sentiment];
          const Sent = sent.Icon;
          const isSel = selectedId === n.id;
          return (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelect(n)}
              className={`group w-full text-left rounded-2xl p-5 glass border transition-all hover:border-electric/40 ${
                isSel ? "border-electric/60 ring-glow-blue" : "border-border/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div className="relative shrink-0 w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-surface to-background ring-1 ring-border">
                  <div className="absolute inset-0 grid-bg opacity-40" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: n.image
                        ? "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35))"
                        : `radial-gradient(circle at 30% 30%, ${n.sourceColor}30, transparent 60%)`,
                    }}
                  />
                  <img
                    src={n.image ?? SIGNALSCOPE_LOGO}
                    alt={n.image ? n.headline : "SignalScope AI logo"}
                    className={`absolute inset-0 h-full w-full ${n.image ? "object-cover" : "object-contain p-4"}`}
                  />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-foreground/80">
                    {n.category}
                  </div>
                  <span
                    className={`absolute top-2 right-2 h-2 w-2 rounded-full ${SEV_DOT[n.severity]}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border"
                      style={{
                        color: n.sourceColor,
                        borderColor: `${n.sourceColor}50`,
                        background: `${n.sourceColor}10`,
                      }}
                    >
                      {n.source}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${sent.cls}`}
                    >
                      <Sent className="h-2.5 w-2.5" />
                      {n.sentiment}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {n.time}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground group-hover:text-electric transition-colors">
                    {n.headline}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                    {n.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      {n.companies.slice(0, 3).map((c) => (
                        <span key={c} className="font-mono px-1.5 py-0.5 rounded bg-white/[0.04]">
                          ${c}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-electric opacity-0 group-hover:opacity-100 transition-opacity">
                      AI Analysis <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
