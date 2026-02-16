"use client";

import { useCallback, useRef, useState } from "react";

function createContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createContext();
    if (ctxRef.current?.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playOpen = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 600, 0.1, "sine", 0.06);
    setTimeout(() => playTone(ctx, 800, 0.1, "sine", 0.04), 60);
  }, [muted, getCtx]);

  const playClose = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 500, 0.12, "sine", 0.05);
    setTimeout(() => playTone(ctx, 350, 0.15, "sine", 0.03), 50);
  }, [muted, getCtx]);

  const playBoot = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.2, "sine", 0.05), i * 120);
    });
  }, [muted, getCtx]);

  const playClick = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, 1000, 0.04, "square", 0.03);
  }, [muted, getCtx]);

  return { playOpen, playClose, playBoot, playClick, muted, setMuted };
}
