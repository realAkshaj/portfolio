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
            className="fixed inset-0 z-[20000] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-[20001] w-[90%] max-w-[520px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.1] glass-heavy window-shadow"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              <Search size={16} className="text-text-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm text-white placeholder-text-dim outline-none"
              />
              <span className="rounded border border-white/[0.1] px-1.5 py-0.5 text-[10px] text-text-dim">ESC</span>
            </div>

            <div className="max-h-[300px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-text-dim">No results found</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    i === selectedIndex ? "bg-accent-blue/10 text-white" : "text-text-dim hover:text-white"
                  }`}
                >
                  <span>{cmd.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-text-dim">{cmd.category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
