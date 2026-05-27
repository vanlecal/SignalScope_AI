import { Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all border-b ${
        scrolled ? "glass-strong border-border/70" : "border-transparent bg-background/40"
      }`}
    >
      <div className="flex items-center h-16 px-4 md:px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-electric to-ai grid place-items-center ring-glow-blue">
            <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric to-ai blur-xl opacity-40 -z-10" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold tracking-tight leading-none">SignalScope</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-ai mt-0.5">AI Terminal</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="group relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-electric transition-colors" />
            <input
              type="text"
              placeholder="Search companies, markets, or global events…"
              className="w-full h-10 pl-10 pr-20 rounded-xl bg-surface/80 border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-electric/50 focus:ring-2 focus:ring-electric/20 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground bg-background/80 border border-border">
                ⌘K
              </kbd>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-ai bg-ai/10 border border-ai/30">
                <Sparkles className="h-2.5 w-2.5" /> AI
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-xl bg-success/10 border border-success/30">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-success">Live Market</span>
        </div>
      </div>
    </header>
  );
}
