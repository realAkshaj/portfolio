"use client";

import { motion } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";

const dockApps: { id: WindowId; emoji: string; label: string; gradient: string }[] = [
  { id: "about", emoji: "👤", label: "About Me", gradient: "from-[#89b4fa] to-[#74c7ec]" },
  { id: "projects", emoji: "📂", label: "Projects", gradient: "from-[#a6e3a1] to-[#94e2d5]" },
  { id: "skills", emoji: "⚡", label: "Skills", gradient: "from-[#cba6f7] to-[#f5c2e7]" },
  { id: "experience", emoji: "💼", label: "Experience", gradient: "from-[#fab387] to-[#f9e2af]" },
  { id: "education", emoji: "🎓", label: "Education", gradient: "from-[#f38ba8] to-[#eb6f92]" },
  { id: "contact", emoji: "✉️", label: "Contact", gradient: "from-[#94e2d5] to-[#89dceb]" },
  { id: "resume", emoji: "📄", label: "Resume", gradient: "from-[#f5c2e7] to-[#cba6f7]" },
  { id: "terminal", emoji: "💻", label: "Terminal", gradient: "from-[#a6adc8] to-[#585b70]" },
  { id: "game", emoji: "🎮", label: "Flappy Bird", gradient: "from-[#a6e3a1] to-[#f9e2af]" },
];

export function Dock() {
  const { windows, openWindow, focusWindow, booted } = useWindowStore();

  if (!booted) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center">
      <motion.div
        className="flex items-end gap-1.5 rounded-2xl border border-white/10 px-3 py-2 glass dock-shadow"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {dockApps.map((item) => {
          const isOpen = windows[item.id]?.isOpen;
          return (
            <motion.button
              key={item.id}
              onClick={() => isOpen ? focusWindow(item.id) : openWindow(item.id)}
              className="group relative flex h-[52px] w-[52px] items-center justify-center rounded-xl md:h-[60px] md:w-[60px]"
              whileHover={{ y: -8, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-200 ${item.gradient} ${
                  isOpen ? "shadow-lg shadow-white/10 ring-2 ring-white/20" : "opacity-60 grayscale-[30%] hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <span className="text-2xl md:text-[28px]">{item.emoji}</span>
              </div>

              {/* Active indicator dot */}
              {isOpen && (
                <motion.span
                  className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-accent-blue shadow-[0_0_6px_rgba(137,180,250,0.6)]"
                  layoutId={`dot-${item.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-base/90 px-3 py-1.5 text-xs text-text opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
