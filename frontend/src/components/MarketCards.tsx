import { motion } from "framer-motion";
import {
  Flame,
  ShieldAlert,
  MessageSquareText,
  TrendingUp,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import type { MarketCardData } from "@/lib/api";

const ICONS = [Flame, ShieldAlert, MessageSquareText, TrendingUp];
const ACCENTS = {
  electric: {
    ring: "ring-electric/30",
    text: "text-electric",
    glow: "from-electric/20 to-transparent",
    border: "border-electric/30",
  },
  ai: {
    ring: "ring-ai/30",
    text: "text-ai",
    glow: "from-ai/20 to-transparent",
    border: "border-ai/30",
  },
  success: {
    ring: "ring-success/30",
    text: "text-success",
    glow: "from-success/20 to-transparent",
    border: "border-success/30",
  },
  warning: {
    ring: "ring-warning/30",
    text: "text-warning",
    glow: "from-warning/15 to-transparent",
    border: "border-warning/30",
  },
};

export function MarketCards({ cards }: { cards: MarketCardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = ICONS[i % ICONS.length] ?? Flame;
        const a = ACCENTS[c.accent];
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-2xl p-5 glass border ${a.border} transition-all hover:ring-1 hover:${a.ring}`}
          >
            <div
              className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${a.glow} blur-2xl opacity-70`}
            />
            <div className="relative flex items-start justify-between mb-4">
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center bg-background/60 ring-1 ${a.ring}`}
              >
                <Icon className={`h-4.5 w-4.5 ${a.text}`} />
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-mono ${c.trend === "flat" ? "text-muted-foreground" : a.text}`}
              >
                {c.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                {c.trend === "flat" && <Minus className="h-3 w-3" />}
                {c.delta}
              </span>
            </div>
            <div className="relative space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                {c.label}
              </div>
              <div className="text-xl font-semibold tracking-tight">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.sub}</div>
            </div>
            {/* Mini sparkline */}
            <svg
              className="relative mt-4 w-full h-8"
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M0 ${20 - i * 2} Q 20 ${10 + i * 3} 40 ${15 - i} T 80 ${8 + i} L 100 ${4 + i * 2} L 100 32 L 0 32 Z`}
                fill={`url(#grad-${i})`}
                className={a.text}
              />
              <path
                d={`M0 ${20 - i * 2} Q 20 ${10 + i * 3} 40 ${15 - i} T 80 ${8 + i} L 100 ${4 + i * 2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={a.text}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
