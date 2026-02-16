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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-crust"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-6 font-mono text-5xl font-bold text-accent-blue"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            A://
          </motion.div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-surface-0">
            <motion.div
              className="h-full rounded-full bg-accent-blue"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          <motion.p
            className="mt-4 font-mono text-xs text-text-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            loading portfolio.sys...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
