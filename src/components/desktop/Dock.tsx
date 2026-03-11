"use client";

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
  Gamepad2,
} from "lucide-react";

const dockApps: { id: WindowId; icon: React.ElementType; label: string }[] = [
  { id: "about", icon: User, label: "About Me" },
  { id: "projects", icon: FolderOpen, label: "Projects" },
  { id: "skills", icon: Zap, label: "Skills" },
  { id: "experience", icon: Briefcase, label: "Experience" },
  { id: "education", icon: GraduationCap, label: "Education" },
  { id: "contact", icon: Mail, label: "Contact" },
  { id: "resume", icon: FileText, label: "Resume" },
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "game", icon: Gamepad2, label: "Flappy Bird" },
];

export function Dock() {
  const { windows, openWindow, focusWindow, booted } = useWindowStore();

  if (!booted) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center">
      <motion.div
        className="flex items-end gap-1 rounded-2xl border border-white/[0.06] px-3 py-2.5 glass dock-shadow"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {dockApps.map((item) => {
          const isOpen = windows[item.id]?.isOpen;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => (isOpen ? focusWindow(item.id) : openWindow(item.id))}
              className="group relative flex h-[48px] w-[48px] items-center justify-center rounded-xl md:h-[52px] md:w-[52px]"
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? "border-accent/20 bg-accent/[0.08] text-accent"
                    : "border-transparent bg-white/[0.03] text-secondary hover:bg-white/[0.06] hover:text-primary"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>

              {/* Active indicator — thin line */}
              {isOpen && (
                <motion.span
                  className="absolute -bottom-1 h-[2px] w-4 rounded-full bg-accent"
                  layoutId={`dot-${item.id}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                />
              )}

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.06] bg-base/95 px-3 py-1.5 font-mono text-[10px] text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
