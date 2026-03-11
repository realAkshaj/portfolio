"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Typewriter terminal widget ─────────────────────────────── */

const LINES = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Akshaj K.S. — MS CS @ UIC | Software Engineer" },
  { prompt: true, text: "status" },
  { prompt: false, text: "Open to New Grad Roles (SWE, ML/AI, Data Science)" },
  { prompt: true, text: "skills --top" },
  { prompt: false, text: "Python, Go, Java, AWS, PyTorch, Distributed Systems" },
];

const TYPE_SPEED = 38;
const LINE_PAUSE = 350;

function TerminalWidget() {
  const [displayed, setDisplayed] = useState<{ prompt: boolean; text: string }[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const result: { prompt: boolean; text: string }[] = [];

    async function typeAll() {
      for (const line of LINES) {
        if (cancelled) return;
        for (let i = 1; i <= line.text.length; i++) {
          if (cancelled) return;
          const partial = { prompt: line.prompt, text: line.text.slice(0, i) };
          if (i === 1) {
            result.push(partial);
          } else {
            result[result.length - 1] = partial;
          }
          setDisplayed([...result]);
          await sleep(TYPE_SPEED);
        }
        await sleep(LINE_PAUSE);
      }
      if (!cancelled) setDone(true);
    }

    typeAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="glass-heavy rounded-xl border border-white/[0.04] px-5 py-4 font-mono text-[12px] leading-relaxed select-none max-w-[480px] w-[90vw] sm:w-auto">
      {displayed.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {line.prompt ? (
            <>
              <span className="text-accent">$</span>{" "}
              <span className="text-primary/80">{line.text}</span>
            </>
          ) : (
            <span className="text-secondary">{line.text}</span>
          )}
        </div>
      ))}
      <span className={`inline-block w-[7px] h-[14px] bg-accent align-middle ${done ? "animate-blink" : ""}`} />
    </div>
  );
}

/* ── Status card widget ─────────────────────────────────────── */

const STATUS_ROWS: [string, string][] = [
  ["Name", "Akshaj K.S."],
  ["Role", "MS CS @ UIC"],
  ["Location", "Chicago, IL"],
  ["Status", "Open to Roles"],
  ["Email", "akshaj32@gmail.com"],
];

function StatusWidget() {
  return (
    <div className="glass-heavy rounded-xl border border-white/[0.04] px-5 py-4 font-mono text-[12px] leading-relaxed select-none max-w-[320px] w-[90vw] sm:w-auto">
      <div className="text-accent/60 mb-2 text-[10px] tracking-wider">
        {">"} status
      </div>
      <table className="border-separate border-spacing-y-[2px]">
        <tbody>
          {STATUS_ROWS.map(([key, val]) => (
            <tr key={key}>
              <td className="text-tertiary pr-2 whitespace-nowrap">{key}</td>
              <td className="text-tertiary pr-2">:</td>
              <td className="text-primary/80 whitespace-nowrap">
                {val}
                {key === "Status" && (
                  <span className="relative ml-2 inline-block h-1.5 w-1.5 rounded-full bg-semantic-green">
                    <span className="absolute inset-0 rounded-full bg-semantic-green animate-ping opacity-60" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Minimizable wrapper ──────────────────────────────────────── */

function MinimizableWidget({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [minimized, setMinimized] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {minimized ? (
        <motion.button
          key="pill"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMinimized(false)}
          className="pointer-events-auto glass-heavy rounded-lg border border-white/[0.04] px-3 py-1.5 font-mono text-[10px] text-tertiary hover:text-primary hover:border-white/[0.08] transition-colors cursor-pointer"
        >
          {label} <span className="text-accent ml-1">+</span>
        </motion.button>
      ) : (
        <motion.div
          key="widget"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <button
            onClick={() => setMinimized(true)}
            className="pointer-events-auto absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/[0.06] bg-surface/90 text-[10px] text-tertiary hover:text-primary hover:border-white/[0.12] transition-colors cursor-pointer"
            aria-label={`Minimize ${label}`}
          >
            &minus;
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Combined layout ────────────────────────────────────────── */

export function DesktopWidgets() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[50] pointer-events-none flex items-center justify-start pl-6 sm:pl-12 lg:pl-20">
      <div className="flex flex-col gap-4 max-h-[calc(100vh-140px)]">
        <MinimizableWidget label="terminal">
          <TerminalWidget />
        </MinimizableWidget>
        <MinimizableWidget label="status">
          <StatusWidget />
        </MinimizableWidget>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
