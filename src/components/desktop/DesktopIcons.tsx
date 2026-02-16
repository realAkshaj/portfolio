"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { desktopIcons } from "@/data/portfolio";

export function DesktopIcons() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const booted = useWindowStore((s) => s.booted);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".desktop-icon")) {
        setSelectedIcon(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!booted) return null;

  return (
    <div className="absolute right-4 top-10 z-[100] flex flex-col gap-2 md:right-5">
      {desktopIcons.map((icon, index) => (
        <motion.div
          key={icon.id}
          className="desktop-icon"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
        >
          <button
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => openWindow(icon.id as WindowId)}
            className={`flex w-[76px] flex-col items-center gap-1 rounded-lg p-2 transition-all md:w-[90px] ${
              selectedIcon === icon.id ? "bg-accent-blue/15" : "hover:bg-white/[0.06]"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br shadow-lg md:h-14 md:w-14 ${icon.gradient}`}
            >
              <span className="text-2xl md:text-[28px]">{icon.emoji}</span>
            </motion.div>
            <span className="text-center text-[10px] leading-tight text-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] md:text-[11px]">
              {icon.label}
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
