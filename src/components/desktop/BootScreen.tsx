"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/window-store";

export function BootScreen() {
  const { booted, setBoot } = useWindowStore();

  useEffect(() => {
    const timer = setTimeout(() => setBoot(true), 2000);
    return () => clearTimeout(timer);
  }, [setBoot]);

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-deep"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="mb-8 font-display text-4xl font-700 tracking-tight text-primary"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            akshaj
            <span className="text-accent">.</span>
          </motion.div>

          {/* Thin line draw */}
          <div className="h-px w-40 bg-subtle overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          <motion.p
            className="mt-5 font-mono text-[11px] tracking-wide text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            initializing...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
