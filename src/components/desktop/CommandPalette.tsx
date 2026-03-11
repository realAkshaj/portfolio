"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore, WindowId } from "@/store/window-store";
import { Search } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

interface Command {
  id: string;
  label: string;
  category: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);

  const commands: Command[] = useMemo(() => [
    { id: "about", label: "Open About Me", category: "Windows", action: () => { openWindow("about"); onClose(); } },
    { id: "projects", label: "Open Projects", category: "Windows", action: () => { openWindow("projects"); onClose(); } },
    { id: "skills", label: "Open Skills", category: "Windows", action: () => { openWindow("skills"); onClose(); } },
    { id: "experience", label: "Open Experience", category: "Windows", action: () => { openWindow("experience"); onClose(); } },
    { id: "education", label: "Open Education", category: "Windows", action: () => { openWindow("education"); onClose(); } },
    { id: "contact", label: "Open Contact", category: "Windows", action: () => { openWindow("contact"); onClose(); } },
    { id: "resume", label: "Open Resume", category: "Windows", action: () => { openWindow("resume"); onClose(); } },
    { id: "terminal", label: "Open Terminal", category: "Windows", action: () => { openWindow("terminal"); onClose(); } },
    { id: "game", label: "Play Flappy Bird", category: "Fun", action: () => { openWindow("game"); onClose(); } },
    { id: "github", label: "Go to GitHub", category: "Links", action: () => { window.open(personalInfo.links.github, "_blank"); onClose(); } },
    { id: "linkedin", label: "Go to LinkedIn", category: "Links", action: () => { window.open(personalInfo.links.linkedin, "_blank"); onClose(); } },
    { id: "email", label: "Send Email", category: "Links", action: () => { window.open(`mailto:${personalInfo.links.email}`, "_blank"); onClose(); } },
  ], [openWindow, onClose]);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[selectedIndex]) { filtered[selectedIndex].action(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[20000] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-[20001] w-[90%] max-w-[480px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.06] glass-heavy window-shadow"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-3">
              <Search size={15} className="text-tertiary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 bg-transparent font-mono text-sm text-primary placeholder-tertiary outline-none"
              />
              <span className="rounded border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-tertiary">ESC</span>
            </div>

            <div className="max-h-[280px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center font-mono text-sm text-tertiary">No results found</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                    i === selectedIndex ? "bg-accent/[0.06] text-accent" : "text-secondary hover:text-primary"
                  }`}
                >
                  <span>{cmd.label}</span>
                  <span className="text-[10px] tracking-wider text-tertiary">{cmd.category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
