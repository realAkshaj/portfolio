"use client";

import { useState, useEffect } from "react";
import { Search, Wifi, Volume2, VolumeX } from "lucide-react";
import { useWindowStore } from "@/store/window-store";

interface MenuBarProps {
  onCommandPalette: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export function MenuBar({ onCommandPalette, muted, onToggleMute }: MenuBarProps) {
  const [time, setTime] = useState("");
  const { booted } = useWindowStore();

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!booted) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-[10000] flex h-9 items-center justify-between border-b border-white/[0.04] px-5 glass">
      {/* Left: Wordmark */}
      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-600 tracking-tight text-primary">
          akshaj<span className="text-accent">.</span>
        </span>
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onCommandPalette}
        className="absolute left-1/2 -translate-x-1/2 flex w-[240px] items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm transition-all hover:border-accent/30 hover:bg-white/[0.04] md:w-[320px]"
      >
        <Search size={13} className="shrink-0 text-tertiary" />
        <span className="flex-1 text-left text-[11px] text-tertiary">Search or command...</span>
        <kbd className="hidden rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-tertiary md:inline">
          Ctrl+K
        </kbd>
      </button>

      {/* Right: System icons + Clock */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="text-tertiary transition-colors hover:text-primary"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
        <Wifi size={13} className="text-tertiary" />
        <span className="font-mono text-[11px] text-secondary">{time}</span>
      </div>
    </header>
  );
}
