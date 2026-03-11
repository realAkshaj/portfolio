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

  useEffect(() => {
    if (!booted) return;
    const timer = setTimeout(() => {
      setToasts([
        {
          id: 1,
          title: "Welcome",
          message: "Double-click icons or use Ctrl+K to explore.",
        },
      ]);
    }, 600);

    const autoDismiss = setTimeout(() => {
      setToasts([]);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismiss);
    };
  }, [booted]);

  return (
    <div className="fixed right-4 top-12 z-[15000] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="w-[280px] overflow-hidden rounded-xl border border-white/[0.06] glass-heavy window-shadow"
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-start gap-3 p-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/[0.06] font-display text-xs font-600 text-accent">
                a
              </div>
              <div className="flex-1">
                <p className="font-display text-[11px] font-500 text-primary">{toast.title}</p>
                <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-tertiary">{toast.message}</p>
              </div>
              <button onClick={() => dismiss(toast.id)} className="shrink-0 text-tertiary hover:text-primary transition-colors">
                <X size={11} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
