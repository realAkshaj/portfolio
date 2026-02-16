"use client";

import { useCallback, useEffect, useRef } from "react";
import { useWindowStore, WindowId } from "@/store/window-store";

export function useDrag(windowId: WindowId) {
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const { updatePosition, focusWindow, windows } = useWindowStore();
  const windowState = windows[windowId];

  const onDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (windowState.isMaximized) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      isDragging.current = true;
      dragOffset.current = {
        x: clientX - windowState.position.x,
        y: clientY - windowState.position.y,
      };

      focusWindow(windowId);
      e.preventDefault();
    },
    [windowState.isMaximized, windowState.position, focusWindow, windowId]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const newX = clientX - dragOffset.current.x;
      const newY = Math.max(28, clientY - dragOffset.current.y);
      updatePosition(windowId, newX, newY);
    };

    const onEnd = () => { isDragging.current = false; };

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
  }, [windowId, updatePosition]);

  return { onDragStart };
}
