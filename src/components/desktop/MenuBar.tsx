"use client";

import { useState, useEffect } from "react";
import { Search, Wifi, Battery, Volume2, VolumeX } from "lucide-react";
import { useWindowStore, WindowId } from "@/store/window-store";

const windowLabels: Record<WindowId, string> = {
  about: "about-me",
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  contact: "contact",
  game: "flappy-bird",
  resume: "resume",
  terminal: "terminal",
};

interface MenuBarProps {
  onCommandPalette: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export function MenuBar({ onCommandPalette, muted, onToggleMute }: MenuBarProps) {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState("");
  const { windows, booted } = useWindowStore();

  useEffect(() => {
    const start = Date.now();
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setUptime(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!booted) return null;

  const focusedWindow = (Object.entries(windows) as [WindowId, typeof windows[WindowId]][])
    .filter(([, w]) => w.isOpen)
    .sort((a, b) => b[1].zIndex - a[1].zIndex)[0];

  const breadcrumb = focusedWindow
    ? `~/desktop/${windowLabels[focusedWindow[0]]}`
    : "~/desktop";

  return (
    <header className="fixed left-0 right-0 top-0 z-[10000] flex h-8 items-center justify-between border-b border-white/[0.08] px-4 glass">
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-bold tracking-wider text-accent-blue">A://</span>
        <span className="text-[11px] text-text-dim">{breadcrumb}</span>
        <span className="hidden text-[10px] text-text-dim/50 md:inline">up {uptime}</span>
      </div>

      {/* Center: Search bar */}
      <button
        onClick={onCommandPalette}
        className="absolute left-1/2 -translate-x-1/2 flex w-[280px] items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-sm text-text-dim transition-all hover:border-accent-blue/40 hover:bg-white/[0.07] md:w-[360px]"
      >
        <Search size={14} className="shrink-0 text-text-dim" />
        <span className="flex-1 text-left text-xs">Search or type a command...</span>
        <kbd className="hidden rounded border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-text-dim md:inline">Ctrl+K</kbd>
      </button>

      {/* Right: System icons + Clock */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMute}
          className="text-text-dim transition-colors hover:text-white"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
        <Wifi size={13} className="text-text-dim" />
        <Battery size={13} className="text-text-dim" />
        <span className="font-mono text-[11px] text-text-dim">{time}</span>
      </div>
    </header>
  );
}
