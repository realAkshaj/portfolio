"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/window-store";
import { Terminal, Info, Palette, RefreshCw } from "lucide-react";

const wallpapers = [
  { id: "cyber", label: "Cyberpunk", gradient: "linear-gradient(135deg, #16213e 0%, #0f3460 40%, #533483 100%)" },
  { id: "ocean", label: "Deep Ocean", gradient: "linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #1a3a5c 100%)" },
  { id: "aurora", label: "Aurora", gradient: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 30%, #2d1b4e 70%, #1b3a2f 100%)" },
  { id: "ember", label: "Ember", gradient: "linear-gradient(135deg, #1a1014 0%, #2d1520 40%, #3d1a2a 70%, #1a1014 100%)" },
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
    // Only show on wallpaper background, not on windows/dock/icons
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
          className="fixed z-[30000] min-w-[200px] overflow-hidden rounded-xl border border-white/[0.1] py-1.5 glass-heavy window-shadow"
          style={{ left: menu.x, top: menu.y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.12 }}
        >
          <button
            onClick={() => { openWindow("terminal"); close(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text transition-colors hover:bg-accent-blue/10 hover:text-white"
          >
            <Terminal size={13} /> Open Terminal
          </button>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowWallpapers(!showWallpapers); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text transition-colors hover:bg-accent-blue/10 hover:text-white"
            >
              <Palette size={13} /> Change Wallpaper
            </button>

            <AnimatePresence>
              {showWallpapers && (
                <motion.div
                  className="absolute left-full top-0 ml-1 min-w-[160px] overflow-hidden rounded-xl border border-white/[0.1] py-1.5 glass-heavy window-shadow"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => { onWallpaperChange(wp.gradient); close(); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text transition-colors hover:bg-accent-blue/10 hover:text-white"
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: wp.gradient }} />
                      {wp.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-2 my-1 border-t border-white/[0.06]" />

          <button
            onClick={() => { window.location.reload(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text transition-colors hover:bg-accent-blue/10 hover:text-white"
          >
            <RefreshCw size={13} /> Restart System
          </button>

          <button
            onClick={() => close()}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text transition-colors hover:bg-accent-blue/10 hover:text-white"
          >
            <Info size={13} /> AkshajOS v1.0
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
