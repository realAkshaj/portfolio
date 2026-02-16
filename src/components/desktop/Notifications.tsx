"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWindowStore } from "@/store/window-store";

interface Toast {
  id: number;
  title: string;
  message: string;
}

export function Notifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const booted = useWindowStore((s) => s.booted);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Welcome toast after boot
  useEffect(() => {
    if (!booted) return;
    const timer = setTimeout(() => {
      setToasts([
        {
          id: 1,
          title: "Welcome to AkshajOS",
          message: "Double-click icons to explore. Try right-clicking the desktop or pressing Ctrl+K.",
        },
      ]);
    }, 600);

    const autoDismiss = setTimeout(() => {
      setToasts([]);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismiss);
    };
  }, [booted]);

  return (
    <div className="fixed right-4 top-10 z-[15000] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="w-[300px] overflow-hidden rounded-xl border border-white/[0.1] glass-heavy window-shadow"
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-start gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/15 font-display text-sm font-bold text-accent-blue">
                A
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">{toast.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-text-dim">{toast.message}</p>
              </div>
              <button onClick={() => dismiss(toast.id)} className="shrink-0 text-text-dim hover:text-white">
                <X size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
