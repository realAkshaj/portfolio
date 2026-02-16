"use client";

import { useState, useEffect } from "react";

/* ── Typewriter terminal widget ─────────────────────────────── */

const LINES = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Akshaj K.S. — MS CS @ UIC | Software Engineer" },
  { prompt: true, text: "status" },
  { prompt: false, text: "Open to New Grad Roles (SWE, ML/AI, Data Science)" },
  { prompt: true, text: "skills --top" },
  { prompt: false, text: "Python, Go, Java, AWS, PyTorch, Distributed Systems" },
];

const TYPE_SPEED = 38; // ms per character
const LINE_PAUSE = 350; // ms pause between lines

function TerminalWidget() {
  const [displayed, setDisplayed] = useState<{ prompt: boolean; text: string }[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const result: { prompt: boolean; text: string }[] = [];

    async function typeAll() {
      for (const line of LINES) {
        if (cancelled) return;
        // type character by character
        for (let i = 1; i <= line.text.length; i++) {
          if (cancelled) return;
          const partial = { prompt: line.prompt, text: line.text.slice(0, i) };
          // replace last partial or push new
          if (result.length > 0 && result[result.length - 1].prompt === line.prompt && result[result.length - 1].text !== line.text.slice(0, i - 1 || 1)) {
            result[result.length - 1] = partial;
          } else if (i === 1) {
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
    <div
      className="glass-heavy rounded-xl border border-white/[0.06] px-5 py-4 font-mono text-[13px] leading-relaxed select-none pointer-events-none max-w-[520px] w-[90vw] sm:w-auto"
    >
      {displayed.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {line.prompt ? (
            <>
              <span className="text-accent-green">$</span>{" "}
              <span className="text-accent-blue">{line.text}</span>
            </>
          ) : (
            <span className="text-text-dim">{line.text}</span>
          )}
        </div>
      ))}
      {/* blinking cursor */}
      <span className={`inline-block w-[8px] h-[15px] bg-accent-blue align-middle ${done ? "animate-blink" : ""}`} />
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
    <div className="glass-heavy rounded-xl border border-white/[0.06] px-5 py-4 font-mono text-[13px] leading-relaxed select-none pointer-events-none max-w-[340px] w-[90vw] sm:w-auto">
      <div className="text-accent-blue mb-2 text-xs tracking-wider opacity-70">
        {">"} status
      </div>
      <table className="border-separate border-spacing-y-[2px]">
        <tbody>
          {STATUS_ROWS.map(([key, val]) => (
            <tr key={key}>
              <td className="text-text-dim pr-2 whitespace-nowrap">{key}</td>
              <td className="text-text-dim pr-2">:</td>
              <td className="text-text whitespace-nowrap">
                {val}
                {key === "Status" && (
                  <span className="relative ml-2 inline-block h-2 w-2 rounded-full bg-accent-green">
                    <span className="absolute inset-0 rounded-full bg-accent-green animate-ping opacity-75" />
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

/* ── Combined layout ────────────────────────────────────────── */

export function DesktopWidgets() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // slight delay so boot screen clears first
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[50] pointer-events-none flex items-center justify-start pl-6 sm:pl-12 lg:pl-20">
      <div className="flex flex-col gap-4 max-h-[calc(100vh-140px)]">
        <TerminalWidget />
        <StatusWidget />
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
