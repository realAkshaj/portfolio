"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { useDrag } from "@/hooks/use-drag";

interface WindowProps {
  id: WindowId;
  title: string;
  children: React.ReactNode;
}

export function Window({ id, title, children }: WindowProps) {
  const { windows, closeWindow, toggleMaximize, focusWindow, topZIndex } = useWindowStore();
  const windowState = windows[id];
  const { onDragStart } = useDrag(id);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = useCallback(() => closeWindow(id), [closeWindow, id]);
  const handleMaximize = useCallback(() => toggleMaximize(id), [toggleMaximize, id]);
  const handleFocus = useCallback(() => focusWindow(id), [focusWindow, id]);

  const getWindowStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { left: "2%", top: "32px", width: "96%", height: "calc(100vh - 100px)", zIndex: windowState.zIndex };
    }
    if (windowState.isMaximized) {
      return { left: 0, top: "28px", width: "100vw", height: "calc(100vh - 28px)", borderRadius: 0, zIndex: windowState.zIndex };
    }
    return {
      left: windowState.position.x, top: windowState.position.y,
      width: windowState.size.width, height: windowState.size.height,
      zIndex: windowState.zIndex,
    };
  };

  const isActive = windowState.zIndex === topZIndex;

  return (
    <AnimatePresence>
      {windowState.isOpen && (
        <motion.div
          className={`absolute flex min-h-[200px] min-w-[320px] flex-col overflow-hidden rounded-xl border border-white/[0.08] glass-heavy ${
            isActive ? "window-shadow-active" : "window-shadow"
          }`}
          style={getWindowStyle()}
          onMouseDown={handleFocus}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="flex h-10 shrink-0 cursor-grab items-center border-b border-white/[0.08] bg-surface-0/60 px-4 active:cursor-grabbing"
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
          >
            <div className="mr-3 flex gap-[7px]">
              <button onClick={handleClose} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-red hover:brightness-110" aria-label="Close">
                <span className="text-[8px] text-transparent group-hover:text-black/60">×</span>
              </button>
              <button onClick={handleClose} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-yellow hover:brightness-110" aria-label="Minimize">
                <span className="text-[8px] text-transparent group-hover:text-black/60">−</span>
              </button>
              <button onClick={handleMaximize} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-green hover:brightness-110" aria-label="Maximize">
                <span className="text-[8px] text-transparent group-hover:text-black/60">+</span>
              </button>
            </div>
            <span className="flex-1 text-center text-[13px] font-medium text-text-dim">{title}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
