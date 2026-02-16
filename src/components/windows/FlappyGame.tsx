"use client";

import { useEffect, useRef, useCallback } from "react";

const GRAVITY = 0.12;
const JUMP = -4;
const MAX_FALL_SPEED = 3;
const PIPE_WIDTH = 55;
const PIPE_GAP = 220;
const PIPE_SPEED = 1.6;
const BIRD_RADIUS = 18;
const BIRD_X = 80;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

type GameState = "idle" | "playing" | "dead";

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // All mutable game state in a single ref so the loop never goes stale
  const game = useRef({
    state: "idle" as GameState,
    birdY: 0,
    velocity: 0,
    pipes: [] as Pipe[],
    score: 0,
    highScore: 0,
    frameCount: 0,
    rotation: 0,
  });

  const resetBird = useCallback(() => {
    const canvas = canvasRef.current;
    const h = canvas ? canvas.height : 400;
    game.current.birdY = h * 0.4;
    game.current.velocity = 0;
    game.current.pipes = [];
    game.current.score = 0;
    game.current.frameCount = 0;
    game.current.rotation = 0;
  }, []);

  const jump = useCallback(() => {
    const g = game.current;
    if (g.state === "idle") {
      resetBird();
      g.state = "playing";
      g.velocity = JUMP;
      return;
    }
    if (g.state === "dead") {
      g.highScore = Math.max(g.highScore, g.score);
      resetBird();
      g.state = "playing";
      g.velocity = JUMP;
      return;
    }
    g.velocity = JUMP;
  }, [resetBird]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  // Game loop — runs once, reads everything from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      if (game.current.state === "idle") {
        game.current.birdY = canvas.height * 0.4;
      }
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Body glow
      ctx.shadowColor = "#89b4fa";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#89b4fa";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_RADIUS, BIRD_RADIUS * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Body
      ctx.fillStyle = "#89b4fa";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_RADIUS, BIRD_RADIUS * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = "#b4d0fb";
      ctx.beginPath();
      ctx.ellipse(-4, -2, BIRD_RADIUS * 0.55, BIRD_RADIUS * 0.35, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eye (white)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(BIRD_RADIUS * 0.4, -BIRD_RADIUS * 0.2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = "#11111b";
      ctx.beginPath();
      ctx.arc(BIRD_RADIUS * 0.5, -BIRD_RADIUS * 0.2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "#f9e2af";
      ctx.beginPath();
      ctx.moveTo(BIRD_RADIUS * 0.7, 0);
      ctx.lineTo(BIRD_RADIUS * 1.2, -3);
      ctx.lineTo(BIRD_RADIUS * 1.2, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, H: number) => {
      const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      gradient.addColorStop(0, "rgba(137, 180, 250, 0.25)");
      gradient.addColorStop(0.5, "rgba(137, 180, 250, 0.15)");
      gradient.addColorStop(1, "rgba(137, 180, 250, 0.25)");

      // Top pipe
      ctx.fillStyle = gradient;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
      ctx.strokeStyle = "rgba(137, 180, 250, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
      // Cap
      ctx.fillStyle = "rgba(137, 180, 250, 0.35)";
      ctx.fillRect(pipe.x - 4, pipe.topH - 16, PIPE_WIDTH + 8, 16);
      ctx.strokeRect(pipe.x - 4, pipe.topH - 16, PIPE_WIDTH + 8, 16);

      // Bottom pipe
      const bottomY = pipe.topH + PIPE_GAP;
      ctx.fillStyle = gradient;
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, H - bottomY);
      ctx.strokeStyle = "rgba(137, 180, 250, 0.5)";
      ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, H - bottomY);
      // Cap
      ctx.fillStyle = "rgba(137, 180, 250, 0.35)";
      ctx.fillRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 16);
      ctx.strokeRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 16);
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const g = game.current;

      // Background
      ctx.fillStyle = "#11111b";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(137, 180, 250, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ---- PLAYING STATE ----
      if (g.state === "playing") {
        g.velocity += GRAVITY;
        if (g.velocity > MAX_FALL_SPEED) g.velocity = MAX_FALL_SPEED;
        g.birdY += g.velocity;
        g.frameCount++;
        g.rotation = Math.min(g.velocity * 0.08, 0.8);

        // Spawn pipes
        if (g.frameCount % 160 === 0) {
          const topH = 60 + Math.random() * (H - PIPE_GAP - 120);
          g.pipes.push({ x: W, topH, scored: false });
        }

        // Move pipes & score
        for (const pipe of g.pipes) {
          pipe.x -= PIPE_SPEED;
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.scored = true;
            g.score++;
          }
        }
        g.pipes = g.pipes.filter((p) => p.x > -PIPE_WIDTH - 10);

        // Collision
        const birdTop = g.birdY - BIRD_RADIUS * 0.8;
        const birdBottom = g.birdY + BIRD_RADIUS * 0.8;

        if (birdTop < 0 || birdBottom > H) {
          g.state = "dead";
          g.highScore = Math.max(g.highScore, g.score);
        }

        for (const pipe of g.pipes) {
          if (BIRD_X + BIRD_RADIUS > pipe.x && BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP) {
              g.state = "dead";
              g.highScore = Math.max(g.highScore, g.score);
            }
          }
        }
      }

      // ---- IDLE bobbing ----
      if (g.state === "idle") {
        g.birdY = H * 0.4 + Math.sin(Date.now() / 400) * 10;
        g.rotation = 0;
      }

      // ---- Draw pipes ----
      for (const pipe of g.pipes) {
        drawPipe(ctx, pipe, H);
      }

      // ---- Draw bird ----
      drawBird(ctx, BIRD_X, g.birdY, g.rotation);

      // ---- Score (playing) ----
      if (g.state === "playing") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "bold 36px monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(g.score), W / 2, 50);
      }

      // ---- Idle overlay ----
      if (g.state === "idle") {
        ctx.fillStyle = "rgba(137, 180, 250, 0.9)";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", W / 2, H * 0.2);

        ctx.fillStyle = "rgba(205, 214, 244, 0.6)";
        ctx.font = "14px monospace";
        ctx.fillText("Click / Tap / Space to play", W / 2, H * 0.2 + 30);

        ctx.fillStyle = "rgba(166, 173, 200, 0.4)";
        ctx.font = "12px monospace";
        ctx.fillText("Avoid the pipes!", W / 2, H * 0.2 + 55);
      }

      // ---- Dead overlay ----
      if (g.state === "dead") {
        ctx.fillStyle = "rgba(17, 17, 27, 0.6)";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#f38ba8";
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H * 0.35);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px monospace";
        ctx.fillText(String(g.score), W / 2, H * 0.35 + 50);

        ctx.fillStyle = "rgba(166, 173, 200, 0.7)";
        ctx.font = "14px monospace";
        ctx.fillText(`Best: ${g.highScore}`, W / 2, H * 0.35 + 80);

        ctx.fillStyle = "rgba(205, 214, 244, 0.5)";
        ctx.font = "13px monospace";
        ctx.fillText("Click to retry", W / 2, H * 0.35 + 115);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []); // Empty deps — loop runs forever, reads from refs

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-pointer select-none touch-none"
      onMouseDown={(e) => { e.stopPropagation(); jump(); }}
      onTouchStart={(e) => { e.stopPropagation(); jump(); }}
      tabIndex={0}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
