"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import {
  User,
  FolderOpen,
  Zap,
  Briefcase,
  GraduationCap,
  Mail,
  FileText,
  Terminal,
} from "lucide-react";

const icons = [
  { id: "about" as const, label: "About Me", icon: User },
  { id: "projects" as const, label: "Projects", icon: FolderOpen },
  { id: "skills" as const, label: "Skills", icon: Zap },
  { id: "experience" as const, label: "Experience", icon: Briefcase },
  { id: "education" as const, label: "Education", icon: GraduationCap },
  { id: "contact" as const, label: "Contact", icon: Mail },
  { id: "resume" as const, label: "Resume", icon: FileText },
  { id: "terminal" as const, label: "Terminal", icon: Terminal },
];

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

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initial: Record<string, IconPosition> = {};
    const maxPerColumn = Math.max(1, Math.floor((window.innerHeight - 120) / 100));
    icons.forEach((icon, i) => {
      const col = Math.floor(i / maxPerColumn);
      const row = i % maxPerColumn;
      initial[icon.id] = {
        x: window.innerWidth - 110 - col * 100,
        y: 50 + row * 100,
      };
    });
    positionsRef.current = initial;
    forceRender((n) => n + 1);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".desktop-icon")) {
        setSelectedIcon(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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
      {icons.map((icon, index) => {
        const pos = positionsRef.current[icon.id];
        if (!pos) return null;
        const Icon = icon.icon;
        const isSelected = selectedIcon === icon.id;
        return (
          <motion.div
            key={icon.id}
            className="desktop-icon absolute z-[100]"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
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
              className={`flex w-[80px] flex-col items-center gap-2 rounded-lg p-2.5 transition-colors ${
                isSelected ? "bg-accent/[0.08]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                  isSelected
                    ? "border-accent/20 bg-accent/[0.06] text-accent"
                    : "border-white/[0.04] bg-white/[0.03] text-secondary"
                }`}
              >
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-center font-mono text-[10px] leading-tight text-secondary drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                {icon.label}
              </span>
            </button>
          </motion.div>
        );
      })}
    </>
  );
}
