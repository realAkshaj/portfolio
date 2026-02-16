"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { useDrag } from "@/hooks/use-drag";

interface WindowProps {
  id: WindowId;
  title: string;
  children: React.ReactNode;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export function Window({ id, title, children }: WindowProps) {
  const { windows, closeWindow, toggleMaximize, focusWindow, topZIndex, updateSize, updatePosition } = useWindowStore();
  const windowState = windows[id];
  const { onDragStart } = useDrag(id);
  const [isMobile, setIsMobile] = useState(false);

  const resizing = useRef<{
    dir: ResizeDirection;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!resizing.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const { dir, startX, startY, startW, startH, startPosX, startPosY } = resizing.current;
      const dx = clientX - startX;
      const dy = clientY - startY;

      let newW = startW;
      let newH = startH;
      let newX = startPosX;
      let newY = startPosY;

      if (dir.includes("e")) newW = startW + dx;
      if (dir.includes("w")) { newW = startW - dx; newX = startPosX + dx; }
      if (dir.includes("s")) newH = startH + dy;
      if (dir.includes("n")) { newH = startH - dy; newY = startPosY + dy; }

      newW = Math.max(320, newW);
      newH = Math.max(200, newH);

      if (dir.includes("w") && newW === 320) newX = startPosX + startW - 320;
      if (dir.includes("n") && newH === 200) newY = startPosY + startH - 200;

      updateSize(id, newW, newH);
      if (dir.includes("w") || dir.includes("n")) {
        updatePosition(id, newX, Math.max(28, newY));
      }
    };

    const onEnd = () => { resizing.current = null; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [id, updateSize, updatePosition]);

  const onResizeStart = useCallback(
    (dir: ResizeDirection) => (e: React.MouseEvent | React.TouchEvent) => {
      if (windowState.isMaximized || isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      resizing.current = {
        dir,
        startX: clientX,
        startY: clientY,
        startW: windowState.size.width,
        startH: windowState.size.height,
        startPosX: windowState.position.x,
        startPosY: windowState.position.y,
      };
      focusWindow(id);
    },
    [windowState, isMobile, focusWindow, id]
  );

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
  const showResizeHandles = !isMobile && !windowState.isMaximized;

  const cursorMap: Record<ResizeDirection, string> = {
    n: "cursor-n-resize", s: "cursor-s-resize",
    e: "cursor-e-resize", w: "cursor-w-resize",
    ne: "cursor-ne-resize", nw: "cursor-nw-resize",
    se: "cursor-se-resize", sw: "cursor-sw-resize",
  };

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
          {/* Resize handles */}
          {showResizeHandles && (
            <>
              {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeDirection[]).map((dir) => {
                const isCorner = dir.length === 2;
                const base = "absolute z-10 " + cursorMap[dir];
                let pos = "";
                if (dir === "n") pos = "top-0 left-2 right-2 h-1.5";
                if (dir === "s") pos = "bottom-0 left-2 right-2 h-1.5";
                if (dir === "e") pos = "right-0 top-2 bottom-2 w-1.5";
                if (dir === "w") pos = "left-0 top-2 bottom-2 w-1.5";
                if (dir === "nw") pos = "top-0 left-0 h-3 w-3";
                if (dir === "ne") pos = "top-0 right-0 h-3 w-3";
                if (dir === "sw") pos = "bottom-0 left-0 h-3 w-3";
                if (dir === "se") pos = "bottom-0 right-0 h-3 w-3";
                return (
                  <div
                    key={dir}
                    className={`${base} ${pos}`}
                    onMouseDown={onResizeStart(dir)}
                    onTouchStart={onResizeStart(dir)}
                  />
                );
              })}
            </>
          )}

          {/* Title bar */}
          <div
            className="flex h-10 shrink-0 cursor-grab items-center border-b border-white/[0.08] bg-surface-0/60 px-4 active:cursor-grabbing"
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onDoubleClick={handleMaximize}
          >
            <div className="mr-3 flex gap-[7px]">
              <button onClick={handleClose} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-red hover:brightness-110" aria-label="Close">
                <span className="text-[8px] text-transparent group-hover:text-black/60">&times;</span>
              </button>
              <button onClick={handleClose} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-yellow hover:brightness-110" aria-label="Minimize">
                <span className="text-[8px] text-transparent group-hover:text-black/60">&minus;</span>
              </button>
              <button onClick={handleMaximize} className="group flex h-3 w-3 items-center justify-center rounded-full bg-accent-green hover:brightness-110" aria-label="Maximize">
                <span className="text-[8px] text-transparent group-hover:text-black/60">+</span>
              </button>
            </div>
            <span className="flex-1 text-center font-display text-[13px] font-medium uppercase tracking-wider text-text-dim">{title}</span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
