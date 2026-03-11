"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/window-store";
import { Terminal, Info, Palette, RefreshCw } from "lucide-react";

const wallpapers = [
  { id: "obsidian", label: "Obsidian", gradient: "radial-gradient(ellipse at 50% 40%, #1a1612 0%, #0C0C0C 70%)" },
  { id: "midnight", label: "Midnight", gradient: "radial-gradient(ellipse at 50% 30%, #141418 0%, #0C0C0C 70%)" },
  { id: "ember", label: "Ember", gradient: "radial-gradient(ellipse at 40% 50%, #1a1210 0%, #0C0C0C 70%)" },
  { id: "void", label: "Void", gradient: "#0C0C0C" },
];

interface ContextMenuProps {
  onWallpaperChange: (gradient: string) => void;
}

export function ContextMenu({ onWallpaperChange }: ContextMenuProps) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [showWallpapers, setShowWallpapers] = useState(false);
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".glass-heavy") || target.closest(".glass") || target.closest(".desktop-icon") || target.closest("button")) {
      return;
    }
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
    setShowWallpapers(false);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setMenu(null);
    setShowWallpapers(false);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, [handleContextMenu, close]);

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          ref={menuRef}
          className="fixed z-[30000] min-w-[180px] overflow-hidden rounded-xl border border-white/[0.06] py-1.5 glass-heavy window-shadow"
          style={{ left: menu.x, top: menu.y }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <button
            onClick={() => { openWindow("terminal"); close(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] text-secondary transition-colors hover:bg-accent/[0.06] hover:text-primary"
          >
            <Terminal size={12} /> Open Terminal
          </button>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowWallpapers(!showWallpapers); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] text-secondary transition-colors hover:bg-accent/[0.06] hover:text-primary"
            >
              <Palette size={12} /> Change Wallpaper
            </button>

            <AnimatePresence>
              {showWallpapers && (
                <motion.div
                  className="absolute left-full top-0 ml-1 min-w-[140px] overflow-hidden rounded-xl border border-white/[0.06] py-1.5 glass-heavy window-shadow"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => { onWallpaperChange(wp.gradient); close(); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] text-secondary transition-colors hover:bg-accent/[0.06] hover:text-primary"
                    >
                      <span className="h-2.5 w-2.5 rounded-full border border-white/[0.08]" style={{ background: wp.gradient }} />
                      {wp.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-2 my-1 border-t border-white/[0.04]" />

          <button
            onClick={() => { window.location.reload(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] text-secondary transition-colors hover:bg-accent/[0.06] hover:text-primary"
          >
            <RefreshCw size={12} /> Restart
          </button>

          <button
            onClick={() => close()}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] text-tertiary transition-colors hover:bg-accent/[0.06] hover:text-secondary"
          >
            <Info size={12} /> akshaj.os v1.0
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
