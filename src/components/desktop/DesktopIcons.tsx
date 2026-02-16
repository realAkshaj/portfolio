"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { desktopIcons } from "@/data/portfolio";

interface IconPosition {
  x: number;
  y: number;
}

export function DesktopIcons() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const booted = useWindowStore((s) => s.booted);

  const positionsRef = useRef<Record<string, IconPosition>>({});
  const [, forceRender] = useState(0);
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const hasMoved = useRef(false);
  const initialized = useRef(false);

  // Initialize positions once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: Record<string, IconPosition> = {};
    const maxPerColumn = Math.max(1, Math.floor((window.innerHeight - 120) / 115));
    desktopIcons.forEach((icon, i) => {
      const col = Math.floor(i / maxPerColumn);
      const row = i % maxPerColumn;
      initial[icon.id] = {
        x: window.innerWidth - 120 - col * 110,
        y: 45 + row * 115,
      };
    });
    positionsRef.current = initial;
    forceRender((n) => n + 1);
  }, []);

  // Deselect on background click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".desktop-icon")) {
        setSelectedIcon(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Global move/end listeners — use RAF to throttle updates
  useEffect(() => {
    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;
    let pendingId: string | null = null;

    const applyMove = () => {
      rafId = null;
      if (!pendingId) return;
      positionsRef.current = {
        ...positionsRef.current,
        [pendingId]: { x: pendingX, y: pendingY },
      };
      forceRender((n) => n + 1);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      hasMoved.current = true;

      pendingId = dragging.current.id;
      pendingX = clientX - dragging.current.offsetX;
      pendingY = clientY - dragging.current.offsetY;

      if (!rafId) {
        rafId = requestAnimationFrame(applyMove);
      }
    };

    const onEnd = () => {
      dragging.current = null;
      pendingId = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const onDragStart = useCallback(
    (id: string, e: React.MouseEvent | React.TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const pos = positionsRef.current[id];
      if (!pos) return;
      hasMoved.current = false;
      dragging.current = {
        id,
        offsetX: clientX - pos.x,
        offsetY: clientY - pos.y,
      };
      setSelectedIcon(id);
    },
    []
  );

  if (!booted || Object.keys(positionsRef.current).length === 0) return null;

  return (
    <>
      {desktopIcons.map((icon, index) => {
        const pos = positionsRef.current[icon.id];
        if (!pos) return null;
        return (
          <motion.div
            key={icon.id}
            className="desktop-icon absolute z-[100]"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
          >
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onDragStart(icon.id, e);
              }}
              onTouchStart={(e) => onDragStart(icon.id, e)}
              onDoubleClick={() => openWindow(icon.id as WindowId)}
              onClick={() => {
                if (!hasMoved.current) setSelectedIcon(icon.id);
              }}
              className={`flex w-[90px] flex-col items-center gap-1.5 rounded-lg p-2 transition-colors ${
                selectedIcon === icon.id ? "bg-accent-blue/15" : "hover:bg-white/[0.06]"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br shadow-lg ${icon.gradient}`}
              >
                <span className="text-[28px]">{icon.emoji}</span>
              </div>
              <span className="text-center text-[11px] leading-tight text-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {icon.label}
              </span>
            </button>
          </motion.div>
        );
      })}
    </>
  );
}
