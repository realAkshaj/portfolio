"use client";

import { motion } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { dockItems } from "@/data/portfolio";

export function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const booted = useWindowStore((s) => s.booted);

  if (!booted) return null;

  return (
    <motion.div
      className="fixed bottom-2 left-1/2 z-[9999] flex items-end gap-1 rounded-2xl border border-white/10 px-2.5 py-1.5 glass dock-shadow"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: "translateX(-50%)" }}
    >
      {dockItems.map((item) => {
        const isOpen = windows[item.id as WindowId]?.isOpen;
        return (
          <motion.button
            key={item.id}
            onClick={() => openWindow(item.id as WindowId)}
            className="group relative flex h-11 w-11 items-center justify-center rounded-xl md:h-[52px] md:w-[52px]"
            whileHover={{ y: -8, scale: 1.15 }}
            whileTap={{ scale: 1.05, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}>
              <span className="text-xl md:text-[26px]">{item.emoji}</span>
            </div>
            {isOpen && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent-blue" />
            )}
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-base/90 px-2.5 py-1 text-[11px] text-text opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
