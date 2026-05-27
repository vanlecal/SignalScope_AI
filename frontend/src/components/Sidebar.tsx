import { useEffect, useState } from "react";
import { LayoutDashboard, Radio, Sparkles, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "feed", label: "Live Feed", icon: Radio },
  { id: "analysis", label: "AI Insights", icon: Sparkles },
  { id: "trends", label: "Market Trends", icon: TrendingUp },
];

export function Sidebar() {
  const [activeId, setActiveId] = useState(items[0].id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section != null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.2, 0.4, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-border/60 glass-strong sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {items.map((it) => {
          const active = activeId === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => handleNavigate(it.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                active
                  ? "text-foreground bg-primary/10 ring-glow-blue"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-electric shadow-[0_0_12px_var(--color-electric)]"
                />
              )}
              <Icon className={`h-4 w-4 ${active ? "text-electric" : ""}`} />
              <span>{it.label}</span>
              {it.label === "Live Feed" && (
                <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/60">
        <div className="rounded-xl p-3 bg-gradient-to-br from-ai/15 to-electric/10 border border-ai/20">
          <div className="flex items-center gap-2 text-xs text-foreground/90 font-semibold mb-1">
            <Activity className="h-3.5 w-3.5 text-ai" />
            AI Engine
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Analyzing <span className="text-foreground font-mono">2,847</span> sources in real time.
          </p>
        </div>
      </div>
    </aside>
  );
}
