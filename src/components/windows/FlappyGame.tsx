"use client";

import { useEffect, useRef, useCallback } from "react";

// Physics
const GRAVITY = 0.35;
const JUMP = -6.5;
const MAX_FALL_SPEED = 8;
const PIPE_WIDTH = 52;
const PIPE_GAP = 130;
const PIPE_SPEED = 2.2;
const BIRD_W = 34;
const BIRD_H = 24;
const BIRD_X = 70;
const GROUND_H = 80;
const GROUND_SPEED = 2.2;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

type GameState = "idle" | "playing" | "dead";

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const game = useRef({
    state: "idle" as GameState,
    birdY: 0,
    velocity: 0,
    pipes: [] as Pipe[],
    score: 0,
    highScore: 0,
    frameCount: 0,
    flapFrame: 0,
    groundX: 0,
    deadTimer: 0,
  });

  const resetBird = useCallback(() => {
    const canvas = canvasRef.current;
    const h = canvas ? canvas.height : 400;
    game.current.birdY = (h - GROUND_H) * 0.4;
    game.current.velocity = 0;
    game.current.pipes = [];
    game.current.score = 0;
    game.current.frameCount = 0;
    game.current.flapFrame = 0;
    game.current.deadTimer = 0;
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
      if (g.deadTimer < 15) return; // prevent accidental restart
      g.highScore = Math.max(g.highScore, g.score);
      resetBird();
      g.state = "playing";
      g.velocity = JUMP;
      return;
    }
    g.velocity = JUMP;
    g.flapFrame = 0;
  }, [resetBird]);

  // Keyboard
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

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      if (game.current.state === "idle") {
        game.current.birdY = (canvas.height - GROUND_H) * 0.4;
      }
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    // --- Draw helpers ---

    const drawSky = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, H - GROUND_H);
      grad.addColorStop(0, "#4ec0ca");
      grad.addColorStop(1, "#71c8d1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H - GROUND_H);
    };

    const drawClouds = (ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      const clouds = [
        { x: 50, y: 40, w: 80, h: 25 },
        { x: 200, y: 70, w: 60, h: 20 },
        { x: 350, y: 30, w: 90, h: 28 },
        { x: 500, y: 55, w: 70, h: 22 },
      ];
      for (const c of clouds) {
        const cx = ((c.x - frame * 0.3) % (W + 100) + W + 100) % (W + 100) - 50;
        ctx.beginPath();
        ctx.ellipse(cx, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawGround = (ctx: CanvasRenderingContext2D, W: number, H: number, groundX: number) => {
      const groundY = H - GROUND_H;
      // Dirt
      ctx.fillStyle = "#ded895";
      ctx.fillRect(0, groundY, W, GROUND_H);
      // Green strip on top
      ctx.fillStyle = "#54b847";
      ctx.fillRect(0, groundY, W, 14);
      // Dark green edge
      ctx.fillStyle = "#4a9e3f";
      ctx.fillRect(0, groundY + 14, W, 3);
      // Ground texture lines
      ctx.strokeStyle = "rgba(180, 160, 100, 0.3)";
      ctx.lineWidth = 2;
      const spacing = 24;
      for (let x = -spacing + (groundX % spacing); x < W + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 30);
        ctx.lineTo(x + 12, groundY + 50);
        ctx.stroke();
      }
    };

    const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, H: number) => {
      const capH = 26;
      const capOverhang = 3;
      const groundY = H - GROUND_H;

      // Top pipe body
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      topGrad.addColorStop(0, "#73bf2e");
      topGrad.addColorStop(0.2, "#8ed349");
      topGrad.addColorStop(0.8, "#6ab423");
      topGrad.addColorStop(1, "#5a9e1c");
      ctx.fillStyle = topGrad;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH - capH);
      // Top pipe cap
      const capGrad = ctx.createLinearGradient(pipe.x - capOverhang, 0, pipe.x + PIPE_WIDTH + capOverhang, 0);
      capGrad.addColorStop(0, "#73bf2e");
      capGrad.addColorStop(0.15, "#9ae050");
      capGrad.addColorStop(0.85, "#6ab423");
      capGrad.addColorStop(1, "#5a9e1c");
      ctx.fillStyle = capGrad;
      ctx.fillRect(pipe.x - capOverhang, pipe.topH - capH, PIPE_WIDTH + capOverhang * 2, capH);
      // Pipe outlines
      ctx.strokeStyle = "#2d6b0e";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topH - capH);
      ctx.strokeRect(pipe.x - capOverhang, pipe.topH - capH, PIPE_WIDTH + capOverhang * 2, capH);

      // Bottom pipe
      const bottomY = pipe.topH + PIPE_GAP;
      ctx.fillStyle = topGrad;
      ctx.fillRect(pipe.x, bottomY + capH, PIPE_WIDTH, groundY - bottomY - capH);
      ctx.fillStyle = capGrad;
      ctx.fillRect(pipe.x - capOverhang, bottomY, PIPE_WIDTH + capOverhang * 2, capH);
      ctx.strokeStyle = "#2d6b0e";
      ctx.strokeRect(pipe.x, bottomY + capH, PIPE_WIDTH, groundY - bottomY - capH);
      ctx.strokeRect(pipe.x - capOverhang, bottomY, PIPE_WIDTH + capOverhang * 2, capH);
    };

    const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, velocity: number, flapFrame: number) => {
      ctx.save();
      ctx.translate(x, y);
      // Tilt based on velocity
      const angle = Math.max(-0.4, Math.min(velocity * 0.06, 1.2));
      ctx.rotate(angle);

      // Body (yellow/orange)
      ctx.fillStyle = "#f8c53a";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_W / 2, BIRD_H / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d4a017";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Belly (lighter)
      ctx.fillStyle = "#fae48b";
      ctx.beginPath();
      ctx.ellipse(2, 3, BIRD_W / 3, BIRD_H / 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      const wingY = flapFrame < 5 ? -4 : 3;
      ctx.fillStyle = "#e8a825";
      ctx.beginPath();
      ctx.ellipse(-4, wingY, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d4a017";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eye (white)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(8, -4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pupil
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(10, -4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Beak (orange)
      ctx.fillStyle = "#e77524";
      ctx.beginPath();
      ctx.moveTo(13, 0);
      ctx.lineTo(22, -2);
      ctx.lineTo(22, 4);
      ctx.lineTo(13, 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#c45d14";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Beak line
      ctx.strokeStyle = "#c45d14";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(13, 2);
      ctx.lineTo(22, 1);
      ctx.stroke();

      ctx.restore();
    };

    const drawScore = (ctx: CanvasRenderingContext2D, W: number, score: number) => {
      const text = String(score);
      ctx.font = "bold 48px Arial, sans-serif";
      ctx.textAlign = "center";
      // Shadow
      ctx.strokeStyle = "#543847";
      ctx.lineWidth = 5;
      ctx.strokeText(text, W / 2, 60);
      // White fill
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, W / 2, 60);
    };

    const drawMedal = (ctx: CanvasRenderingContext2D, x: number, y: number, score: number) => {
      if (score < 5) return;
      const color = score >= 40 ? "#ffd700" : score >= 20 ? "#c0c0c0" : "#cd7f32";
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Star
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", x, y + 1);
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const g = game.current;
      const groundY = H - GROUND_H;

      // --- Update ---
      if (g.state === "playing") {
        g.velocity += GRAVITY;
        if (g.velocity > MAX_FALL_SPEED) g.velocity = MAX_FALL_SPEED;
        g.birdY += g.velocity;
        g.frameCount++;
        g.flapFrame = (g.flapFrame + 1) % 10;
        g.groundX = (g.groundX + GROUND_SPEED) % 24;

        // Spawn pipes
        if (g.frameCount % 95 === 0) {
          const minTop = 60;
          const maxTop = groundY - PIPE_GAP - 60;
          const topH = minTop + Math.random() * (maxTop - minTop);
          g.pipes.push({ x: W, topH, scored: false });
        }

        // Move & score
        for (const pipe of g.pipes) {
          pipe.x -= PIPE_SPEED;
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.scored = true;
            g.score++;
          }
        }
        g.pipes = g.pipes.filter((p) => p.x > -PIPE_WIDTH - 10);

        // Collision
        const birdTop = g.birdY - BIRD_H / 2;
        const birdBottom = g.birdY + BIRD_H / 2;
        const birdLeft = BIRD_X - BIRD_W / 2;
        const birdRight = BIRD_X + BIRD_W / 2;

        if (birdBottom > groundY) {
          g.birdY = groundY - BIRD_H / 2;
          g.state = "dead";
          g.highScore = Math.max(g.highScore, g.score);
        }
        if (birdTop < 0) {
          g.birdY = BIRD_H / 2;
          g.velocity = 0;
        }

        for (const pipe of g.pipes) {
          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP) {
              g.state = "dead";
              g.highScore = Math.max(g.highScore, g.score);
            }
          }
        }
      }

      if (g.state === "dead") {
        g.deadTimer++;
        // Bird falls to ground
        if (g.birdY < groundY - BIRD_H / 2) {
          g.velocity += GRAVITY;
          if (g.velocity > MAX_FALL_SPEED) g.velocity = MAX_FALL_SPEED;
          g.birdY += g.velocity;
          if (g.birdY > groundY - BIRD_H / 2) {
            g.birdY = groundY - BIRD_H / 2;
          }
        }
      }

      if (g.state === "idle") {
        g.birdY = (groundY) * 0.4 + Math.sin(Date.now() / 300) * 8;
        g.flapFrame = Math.floor(Date.now() / 150) % 10;
        g.groundX = (Date.now() / 15) % 24;
      }

      // --- Render ---
      drawSky(ctx, W, H);
      drawClouds(ctx, W, H, g.state === "idle" ? Date.now() / 40 : g.frameCount);

      for (const pipe of g.pipes) {
        drawPipe(ctx, pipe, H);
      }

      drawGround(ctx, W, H, g.groundX);
      drawBird(ctx, BIRD_X, g.birdY, g.state === "idle" ? -1 : g.velocity, g.flapFrame);

      // Score during play
      if (g.state === "playing") {
        drawScore(ctx, W, g.score);
      }

      // Idle screen
      if (g.state === "idle") {
        // Title
        ctx.font = "bold 32px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#543847";
        ctx.lineWidth = 4;
        ctx.strokeText("Flappy Bird", W / 2, H * 0.15);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Flappy Bird", W / 2, H * 0.15);

        // Tap prompt
        const blink = Math.sin(Date.now() / 400) > 0;
        if (blink) {
          ctx.font = "18px Arial, sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#543847";
          ctx.lineWidth = 3;
          ctx.strokeText("TAP TO START", W / 2, groundY - 40);
          ctx.fillText("TAP TO START", W / 2, groundY - 40);
        }
      }

      // Game over screen
      if (g.state === "dead" && g.deadTimer > 10) {
        // Scoreboard panel
        const panelW = 220;
        const panelH = 130;
        const px = (W - panelW) / 2;
        const py = H * 0.2;

        // "Game Over" text
        ctx.font = "bold 30px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#543847";
        ctx.lineWidth = 4;
        ctx.strokeText("Game Over", W / 2, py - 10);
        ctx.fillStyle = "#fc3e3e";
        ctx.fillText("Game Over", W / 2, py - 10);

        // Panel background
        ctx.fillStyle = "#deb960";
        ctx.fillRect(px, py + 10, panelW, panelH);
        ctx.strokeStyle = "#543847";
        ctx.lineWidth = 3;
        ctx.strokeRect(px, py + 10, panelW, panelH);
        ctx.fillStyle = "#c8a84e";
        ctx.fillRect(px + 6, py + 16, panelW - 12, panelH - 12);

        // Score
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#fff";
        ctx.fillText("SCORE", px + 65, py + 45);
        ctx.font = "bold 28px Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.fillText(String(g.score), px + panelW - 20, py + 50);

        // Best
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#fff";
        ctx.fillText("BEST", px + 65, py + 90);
        ctx.font = "bold 28px Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.fillText(String(g.highScore), px + panelW - 20, py + 95);

        // Medal
        drawMedal(ctx, px + 35, py + 70, g.score);

        // Retry prompt
        if (g.deadTimer > 15) {
          const blink = Math.sin(Date.now() / 350) > 0;
          if (blink) {
            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#543847";
            ctx.lineWidth = 3;
            ctx.strokeText("TAP TO RETRY", W / 2, py + panelH + 45);
            ctx.fillText("TAP TO RETRY", W / 2, py + panelH + 45);
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

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
