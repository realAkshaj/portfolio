"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { personalInfo, skills, projects, experiences, expertiseAreas } from "@/data/portfolio";
import { useWindowStore } from "@/store/window-store";

interface Line {
  type: "input" | "output";
  text: string;
}

const NEOFETCH = `
  ▄▄▄       ██ ▄█▀  akshaj@portfolio
 ▒████▄     ██▄█▒   ──────────────────
 ▒██  ▀█▄  ▓███▄░   OS: AkshajOS v1.0
 ░██▄▄▄▄██ ▓██ █▄   Host: UIC Chicago
  ▓█   ▓██▒▒██▒ █▄  Kernel: Next.js 14
  ▒▒   ▓▒█░▒ ▒▒ ▓▒  Shell: TypeScript 5.7
   ▒   ▒▒ ░░ ░▒ ▒░  DE: React 18
   ░   ▒   ░ ░░ ░   WM: Framer Motion
       ░  ░  ░      Theme: Catppuccin Mocha
                     Terminal: Portfolio v1.0
                     CPU: Caffeine-powered
                     Memory: ${skills.length} skills loaded
`;

export function TerminalContent() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "AkshajOS v1.0 — Type 'help' for available commands." },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = useCallback((cmd: string): string[] => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    switch (command) {
      case "help":
        return [
          "Available commands:",
          "  whoami        — Who am I?",
          "  neofetch      — System info",
          "  ls            — List sections",
          "  cat <file>    — View a section (about, skills, projects, experience)",
          "  open <window> — Open a window",
          "  history       — Command history",
          "  clear         — Clear terminal",
          "  echo <text>   — Print text",
          "  date          — Current date",
          "  uptime        — System uptime",
          "  sudo <cmd>    — Try it :)",
          "",
        ];
      case "whoami":
        return [
          `${personalInfo.name}`,
          `${personalInfo.title}`,
          `📍 ${personalInfo.location}`,
          "",
          ...personalInfo.bio,
          "",
        ];
      case "neofetch":
        return NEOFETCH.split("\n");
      case "ls":
        return [
          "drwxr-xr-x  about/",
          "drwxr-xr-x  projects/",
          "drwxr-xr-x  skills/",
          "drwxr-xr-x  experience/",
          "drwxr-xr-x  education/",
          "-rw-r--r--  resume.pdf",
          "-rw-r--r--  contact.txt",
          "",
        ];
      case "cat":
        if (!arg) return ["Usage: cat <filename>", "Try: cat about, cat skills, cat projects, cat experience", ""];
        if (arg === "about" || arg === "about/") {
          return [...personalInfo.bio, ""];
        }
        if (arg === "skills" || arg === "skills/") {
          return [
            "Technical Proficiency:",
            ...skills.map((s) => `  ${s.name.padEnd(24)} ${"█".repeat(Math.floor(s.level / 5))}${"░".repeat(20 - Math.floor(s.level / 5))} ${s.level}%`),
            "",
            "Domains: " + expertiseAreas.join(", "),
            "",
          ];
        }
        if (arg === "projects" || arg === "projects/") {
          return projects.flatMap((p) => [
            `▸ ${p.name} [${p.tag}]`,
            `  ${p.description}`,
            `  Tech: ${p.tech.join(", ")}`,
            "",
          ]);
        }
        if (arg === "experience" || arg === "experience/") {
          return experiences.flatMap((e) => [
            `▸ ${e.role} @ ${e.company}`,
            `  ${e.date}${e.location ? ` — ${e.location}` : ""}`,
            `  ${e.description}`,
            "",
          ]);
        }
        return [`cat: ${arg}: No such file or directory`, ""];
      case "open":
        if (!arg) return ["Usage: open <window>", "Windows: about, projects, skills, experience, education, contact, game, resume", ""];
        const validWindows = ["about", "projects", "skills", "experience", "education", "contact", "game", "resume", "terminal"];
        if (validWindows.includes(arg)) {
          openWindow(arg as any);
          return [`Opening ${arg}...`, ""];
        }
        return [`open: ${arg}: not found`, ""];
      case "echo":
        return [arg || "", ""];
      case "date":
        return [new Date().toString(), ""];
      case "uptime":
        return [`System up since page load. Powered by caffeine and curiosity.`, ""];
      case "clear":
        setLines([]);
        return [];
      case "history":
        return [...history.map((h, i) => `  ${i + 1}  ${h}`), ""];
      case "sudo":
        return ["Nice try. 🔒 Permission denied: you're not root on this portfolio.", ""];
      case "":
        return [];
      default:
        return [`command not found: ${command}. Type 'help' for available commands.`, ""];
    }
  }, [history, openWindow]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (cmd) {
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);
    }
    const output = processCommand(cmd);
    setLines((prev) => [
      ...prev,
      { type: "input", text: cmd },
      ...output.map((text) => ({ type: "output" as const, text })),
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    }
  };

  return (
    <div
      className="flex h-full flex-col font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line.type === "input" ? (
              <span>
                <span className="text-accent-green">akshaj@portfolio</span>
                <span className="text-text-dim">:</span>
                <span className="text-accent-blue">~</span>
                <span className="text-white">$ {line.text}</span>
              </span>
            ) : (
              <span className="text-text-dim">{line.text}</span>
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-accent-green">akshaj@portfolio</span>
          <span className="text-text-dim">:</span>
          <span className="text-accent-blue">~</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none caret-accent-blue"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
