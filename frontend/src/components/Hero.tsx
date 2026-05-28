import { motion } from "framer-motion";
import { ArrowRight, Radio, Sparkles } from "lucide-react";
import orb from "@/assets/ai-orb.jpg";
import type { DashboardMetrics } from "@/lib/api";

export function Hero({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 glass">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 opacity-80" style={{ background: "var(--gradient-hero)" }} />

      {/* floating particles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-electric/60 animate-float"
          style={{
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}

      <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 p-6 md:p-10 lg:p-14 items-center">
        <div className="space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-ai/10 border border-ai/30 text-ai"
          >
            <Sparkles className="h-3 w-3" />
            Live AI Intelligence · v2.4
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
          >
            AI-Powered <span className="gradient-text-ai">Market Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            {metrics.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <button className="group inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-br from-electric to-ai text-white font-medium text-sm ring-glow-blue hover:shadow-[0_0_30px_var(--color-electric)] transition-all">
              <Radio className="h-4 w-4" />
              Explore Live Feed
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-surface/80 border border-border text-foreground font-medium text-sm hover:bg-surface hover:border-electric/40 transition-all">
              Start Monitoring
            </button>
          </motion.div>
        </div>

        {/* AI Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="relative hidden md:block w-[260px] lg:w-[320px] aspect-square shrink-0"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric/40 to-ai/40 blur-3xl animate-pulse-glow" />
          <img
            src={orb}
            alt=""
            width={1024}
            height={1024}
            className="relative w-full h-full object-cover rounded-full mix-blend-screen"
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-electric/30" />
        </motion.div>
      </div>

      {/* Ticker tape */}
      <div className="relative border-t border-border/60 bg-background/40 backdrop-blur">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 gap-8 py-3 px-6 animate-[shimmer_30s_linear_infinite] [animation:none] whitespace-nowrap">
            {[...metrics.tickers, ...metrics.tickers].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">{t.sym}</span>
                <span className="text-foreground font-medium">{t.val}</span>
                <span className={t.up ? "text-success" : "text-destructive"}>{t.chg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
