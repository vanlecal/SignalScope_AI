import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/60 bg-[#081420] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
        {/* Social icons centered */}
        <div className="flex items-center justify-center gap-5 sm:gap-7">
          <a
            href="mailto:neutral520@gmail.com"
            aria-label="email"
            className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-slate-100 hover:bg-white/15 transition transform hover:scale-105"
          >
            <Mail className="h-8 w-8" />
          </a>

          <a
            href="https://github.com/markdrahg"
            aria-label="github"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-slate-100 hover:bg-white/15 transition transform hover:scale-105"
          >
            <Github className="h-8 w-8" />
          </a>

          <a
            href="https://www.linkedin.com/in/markdrah"
            aria-label="linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-slate-100 hover:bg-white/15 transition transform hover:scale-105"
          >
            <Linkedin className="h-8 w-8" />
          </a>
        </div>

        {/* Credit row */}
        <div className="mt-2 text-sm text-slate-400 flex flex-col items-center gap-3">
          <div className="opacity-80">Designed by MDD</div>
          <div className="opacity-70">© {year} SignalScope AI</div>
        </div>
      </div>
    </footer>
  );
}
