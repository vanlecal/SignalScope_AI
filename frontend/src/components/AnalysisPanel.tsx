import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, AlertTriangle, TrendingUp, Building2, Factory, Brain, ShieldCheck } from "lucide-react";
import type { NewsItem } from "@/lib/mock-data";

const SEV = {
  low: { label: "Low Impact", cls: "text-success bg-success/10 border-success/30", dot: "bg-success" },
  moderate: { label: "Moderate Impact", cls: "text-warning bg-warning/10 border-warning/30", dot: "bg-warning" },
  high: { label: "High Impact", cls: "text-destructive bg-destructive/10 border-destructive/30", dot: "bg-destructive" },
};

export function AnalysisPanel({ item, onClose }: { item: NewsItem | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] lg:w-[420px] xl:w-[460px] glass-strong border-l border-border/70 flex flex-col"
          >
            {/* Header */}
            <div className="relative p-5 border-b border-border/60 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-ai/10 to-electric/5 pointer-events-none" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-electric to-ai grid place-items-center ring-glow-ai">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-ai">AI Analysis</div>
                    <div className="text-sm font-semibold">SignalScope Engine</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className={`relative mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md border ${SEV[item.severity].cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${SEV[item.severity].dot} animate-pulse`} />
                {SEV[item.severity].label}
              </div>

              <h3 className="relative mt-3 text-base font-semibold leading-snug">{item.headline}</h3>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-5 space-y-5">
                <Section icon={Factory} label="Affected Industries" tint="text-electric">
                  <div className="flex flex-wrap gap-1.5">
                    {item.industries.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-electric/10 border border-electric/25 text-electric font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section icon={Building2} label="Affected Companies" tint="text-ai">
                  <div className="flex flex-wrap gap-1.5">
                    {item.companies.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-ai/10 border border-ai/25 text-ai font-mono">
                        ${s}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section icon={TrendingUp} label="Opportunities" tint="text-success">
                  <ul className="space-y-2">
                    {item.opportunities.map((o, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={AlertTriangle} label="Risks" tint="text-destructive">
                  <ul className="space-y-2">
                    {item.risks.map((o, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Sparkles} label="AI Reasoning" tint="text-ai">
                  <div className="relative rounded-xl p-4 bg-gradient-to-br from-ai/10 via-electric/5 to-transparent border border-ai/20">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-ai/20 to-electric/10 -z-10 blur" />
                    <p className="text-sm leading-relaxed text-foreground/95">{item.reasoning}</p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-success" />
                      Confidence: <span className="text-success">87%</span>
                      <span className="mx-1">·</span>
                      Sources cross-verified: <span className="text-foreground">14</span>
                    </div>
                  </div>
                </Section>
              </div>
            </div>

            <div className="p-4 border-t border-border/60 shrink-0">
              <button className="w-full h-10 rounded-xl bg-gradient-to-br from-electric to-ai text-white text-sm font-medium hover:shadow-[0_0_24px_var(--color-electric)] transition-all">
                Read Full Article
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  label,
  tint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className={`h-3.5 w-3.5 ${tint}`} />
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}
