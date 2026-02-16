"use client";

import { useState, useEffect } from "react";
import { useWindowStore, WindowId } from "@/store/window-store";

export function MenuBar() {
  const [time, setTime] = useState("");
  const openWindow = useWindowStore((s) => s.openWindow);
  const booted = useWindowStore((s) => s.booted);

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric",
          hour: "numeric", minute: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!booted) return null;

  const menuItems: { label: string; windowId: WindowId }[] = [
    { label: "About", windowId: "about" },
    { label: "Projects", windowId: "projects" },
    { label: "Experience", windowId: "experience" },
    { label: "Contact", windowId: "contact" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-[10000] flex h-7 items-center justify-between border-b border-white/[0.08] px-3 glass">
      <div className="flex items-center gap-5">
        <span className="font-mono text-sm font-bold text-accent-blue">A://</span>
        {menuItems.map((item) => (
          <button
            key={item.windowId}
            onClick={() => openWindow(item.windowId)}
            className="text-xs tracking-wide text-text-dim transition-colors hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-text-dim">{time}</div>
    </header>
  );
}
