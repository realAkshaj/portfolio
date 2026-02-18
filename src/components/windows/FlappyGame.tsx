"use client";

import { useEffect, useRef, useCallback } from "react";

// Physics — floaty, forgiving
const GRAVITY = 0.2;
const JUMP = -5.0;
const MAX_FALL_SPEED = 5.5;
const PIPE_WIDTH = 52;
const PIPE_GAP = 165;
const PIPE_SPEED = 2.0;
const BIRD_W = 34;
const BIRD_H = 24;
const BIRD_X = 70;
const GROUND_H = 56;
const GROUND_SPEED = 2.0;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
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
    flashAlpha: 0,
    particles: [] as Particle[],
    shakeX: 0,
    shakeY: 0,
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
    game.current.flashAlpha = 0;
    game.current.particles = [];
    game.current.shakeX = 0;
    game.current.shakeY = 0;
  }, []);

  const spawnDeathParticles = useCallback((x: number, y: number) => {
    const g = game.current;
    const colors = ["#f8c53a", "#fae48b", "#e8a825", "#fff", "#f9d77e"];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      g.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
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
      if (g.deadTimer < 20) return;
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

    // --- Flappy Bird font ---
    const flappyFont = new FontFace("FlappyBird", "url(/fonts/flappy-font.ttf)");
    let fontLoaded = false;
    flappyFont.load().then((font) => {
      document.fonts.add(font);
      fontLoaded = true;
    });
    const ff = (size: number) =>
      fontLoaded ? `${size}px FlappyBird` : `bold ${size}px Arial, sans-serif`;

    const drawFlappyText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      size: number,
      fill: string,
      outlineColor?: string,
      outlineWidth = 4,
    ) => {
      ctx.font = ff(size);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (outlineColor) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeText(text, x, y);
      }
      ctx.fillStyle = fill;
      ctx.fillText(text, x, y);
    };

    // --- Render helpers ---

    const drawSky = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, H - GROUND_H);
      grad.addColorStop(0, "#87CEEB");
      grad.addColorStop(0.6, "#B0E0E6");
      grad.addColorStop(1, "#E0F0E8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H - GROUND_H);
    };

    const drawClouds = (ctx: CanvasRenderingContext2D, W: number, _H: number, offset: number) => {
      const clouds = [
        { baseX: 0, y: 35, puffs: [[0,0,40,18],[30,-5,35,16],[55,2,30,14]] },
        { baseX: 220, y: 65, puffs: [[0,0,35,15],[25,-3,30,13]] },
        { baseX: 420, y: 25, puffs: [[0,0,45,20],[35,-6,38,17],[65,0,32,15]] },
        { baseX: 600, y: 50, puffs: [[0,0,30,13],[22,-4,28,12]] },
      ];
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (const cloud of clouds) {
        const bx = ((cloud.baseX - offset * 0.15) % (W + 200) + W + 200) % (W + 200) - 100;
        for (const [px, py, rw, rh] of cloud.puffs) {
          ctx.beginPath();
          ctx.ellipse(bx + px, cloud.y + py, rw, rh, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Far background — soft hills
    const drawHills = (ctx: CanvasRenderingContext2D, W: number, H: number, offset: number) => {
      const groundY = H - GROUND_H;
      ctx.fillStyle = "rgba(100, 180, 100, 0.25)";
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= W; x += 2) {
        const y = groundY - 30 - Math.sin((x + offset * 0.3) * 0.008) * 20 - Math.sin((x + offset * 0.3) * 0.015) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, groundY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(80, 160, 80, 0.3)";
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= W; x += 2) {
        const y = groundY - 15 - Math.sin((x + offset * 0.6 + 100) * 0.012) * 15 - Math.sin((x + offset * 0.6) * 0.02) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, groundY);
      ctx.closePath();
      ctx.fill();
    };

    const drawGround = (ctx: CanvasRenderingContext2D, W: number, H: number, groundX: number) => {
      const groundY = H - GROUND_H;

      // Main dirt
      const dirtGrad = ctx.createLinearGradient(0, groundY, 0, H);
      dirtGrad.addColorStop(0, "#d2b04c");
      dirtGrad.addColorStop(0.3, "#c9a545");
      dirtGrad.addColorStop(1, "#b8943d");
      ctx.fillStyle = dirtGrad;
      ctx.fillRect(0, groundY, W, GROUND_H);

      // Green grass top
      const grassGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 16);
      grassGrad.addColorStop(0, "#5ec941");
      grassGrad.addColorStop(1, "#4ab536");
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, groundY, W, 16);

      // Grass highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, groundY, W, 4);

      // Grass edge shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, groundY + 16, W, 2);

      // Dirt texture — diagonal hash marks
      ctx.strokeStyle = "rgba(160, 130, 60, 0.25)";
      ctx.lineWidth = 1.5;
      const spacing = 18;
      const gx = groundX % spacing;
      for (let x = -spacing + gx; x < W + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 24);
        ctx.lineTo(x + 8, groundY + 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 9, groundY + 26);
        ctx.lineTo(x + 14, groundY + 36);
        ctx.stroke();
      }
    };

    const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, H: number) => {
      const capH = 26;
      const capOv = 4; // overhang
      const groundY = H - GROUND_H;
      const r = 4; // corner radius for caps

      // --- Top pipe ---
      // Body
      const bodyGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      bodyGrad.addColorStop(0, "#5aad1e");
      bodyGrad.addColorStop(0.15, "#78cc3c");
      bodyGrad.addColorStop(0.4, "#6dbe32");
      bodyGrad.addColorStop(0.85, "#59a81d");
      bodyGrad.addColorStop(1, "#4a8f16");
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH - capH);

      // Body highlight
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(pipe.x + 4, 0, 6, pipe.topH - capH);

      // Body shadow
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(pipe.x + PIPE_WIDTH - 6, 0, 6, pipe.topH - capH);

      // Cap
      const capGrad = ctx.createLinearGradient(pipe.x - capOv, 0, pipe.x + PIPE_WIDTH + capOv, 0);
      capGrad.addColorStop(0, "#5aad1e");
      capGrad.addColorStop(0.12, "#82d44a");
      capGrad.addColorStop(0.4, "#72c438");
      capGrad.addColorStop(0.85, "#59a81d");
      capGrad.addColorStop(1, "#4a8f16");
      ctx.fillStyle = capGrad;
      roundRect(ctx, pipe.x - capOv, pipe.topH - capH, PIPE_WIDTH + capOv * 2, capH, r);
      ctx.fill();

      // Cap highlight
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(pipe.x - capOv + 4, pipe.topH - capH + 3, 6, capH - 6);

      // Outlines
      ctx.strokeStyle = "rgba(40, 80, 15, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topH - capH);
      roundRect(ctx, pipe.x - capOv, pipe.topH - capH, PIPE_WIDTH + capOv * 2, capH, r);
      ctx.stroke();

      // --- Bottom pipe ---
      const bottomY = pipe.topH + PIPE_GAP;
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(pipe.x, bottomY + capH, PIPE_WIDTH, groundY - bottomY - capH);

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(pipe.x + 4, bottomY + capH, 6, groundY - bottomY - capH);
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(pipe.x + PIPE_WIDTH - 6, bottomY + capH, 6, groundY - bottomY - capH);

      ctx.fillStyle = capGrad;
      roundRect(ctx, pipe.x - capOv, bottomY, PIPE_WIDTH + capOv * 2, capH, r);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(pipe.x - capOv + 4, bottomY + 3, 6, capH - 6);

      ctx.strokeStyle = "rgba(40, 80, 15, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, bottomY + capH, PIPE_WIDTH, groundY - bottomY - capH);
      roundRect(ctx, pipe.x - capOv, bottomY, PIPE_WIDTH + capOv * 2, capH, r);
      ctx.stroke();
    };

    const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, velocity: number, flapFrame: number, isDead: boolean) => {
      ctx.save();
      ctx.translate(x, y);

      // Rotation
      let angle: number;
      if (isDead) {
        angle = Math.min(game.current.deadTimer * 0.08, Math.PI / 2);
      } else {
        angle = velocity * 0.055;
        angle = Math.max(-0.45, Math.min(angle, 1.3));
      }
      ctx.rotate(angle);

      // Shadow under bird
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.beginPath();
      ctx.ellipse(2, 3, BIRD_W / 2 - 2, BIRD_H / 2 - 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      const bodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, BIRD_W / 2);
      bodyGrad.addColorStop(0, "#ffe066");
      bodyGrad.addColorStop(0.6, "#f8c53a");
      bodyGrad.addColorStop(1, "#e6a817");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_W / 2, BIRD_H / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body outline
      ctx.strokeStyle = "rgba(180, 120, 20, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Belly
      ctx.fillStyle = "rgba(255, 240, 180, 0.6)";
      ctx.beginPath();
      ctx.ellipse(2, 4, BIRD_W / 3.5, BIRD_H / 4, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      const wingAngle = flapFrame < 5 ? -0.3 : 0.15;
      const wingY = flapFrame < 5 ? -5 : 3;
      ctx.save();
      ctx.translate(-3, wingY);
      ctx.rotate(wingAngle);
      const wingGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 10);
      wingGrad.addColorStop(0, "#f0c040");
      wingGrad.addColorStop(1, "#d49a18");
      ctx.fillStyle = wingGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 7, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(180, 120, 20, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Eye white
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(8, -4, 6.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(80, 60, 30, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pupil — looks forward when alive, X when dead
      if (isDead) {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, -6); ctx.lineTo(10, -2);
        ctx.moveTo(10, -6); ctx.lineTo(6, -2);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        ctx.ellipse(10, -3.5, 3, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(11, -5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Beak
      ctx.fillStyle = "#e8652a";
      ctx.beginPath();
      ctx.moveTo(12, -1);
      ctx.quadraticCurveTo(23, -3, 22, 1);
      ctx.quadraticCurveTo(23, 5, 12, 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(160, 60, 20, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Beak divider
      ctx.strokeStyle = "rgba(160, 60, 20, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 2);
      ctx.quadraticCurveTo(18, 1.5, 22, 1);
      ctx.stroke();

      // Lower beak slightly lighter
      ctx.fillStyle = "#f07030";
      ctx.beginPath();
      ctx.moveTo(12, 2);
      ctx.quadraticCurveTo(18, 1.5, 22, 1);
      ctx.quadraticCurveTo(23, 5, 12, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawScore = (ctx: CanvasRenderingContext2D, W: number, score: number) => {
      drawFlappyText(ctx, String(score), W / 2, 42, 56, "#ffffff", "#543847", 6);
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
      const g = game.current;
      for (const p of g.particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawMedal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, score: number) => {
      if (score < 5) return;
      const isGold = score >= 40;
      const isSilver = score >= 20;
      const baseColor = isGold ? "#ffd700" : isSilver ? "#c0c0c0" : "#cd7f32";
      const highlight = isGold ? "#fff4a3" : isSilver ? "#e8e8e8" : "#e0a060";
      const shadow = isGold ? "#b8960a" : isSilver ? "#888" : "#8a5520";

      // Medal circle
      const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 20);
      grad.addColorStop(0, highlight);
      grad.addColorStop(0.6, baseColor);
      grad.addColorStop(1, shadow);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shadow;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Star — draw a 5-pointed star with pixels
      const starColor = isGold ? "#fff" : "rgba(255,255,255,0.8)";
      const sp = 2; // pixel size
      const starPattern = [
        [0,0,1,0,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,1,0,1,0],
      ];
      ctx.fillStyle = starColor;
      for (let r = 0; r < starPattern.length; r++) {
        for (let c = 0; c < starPattern[r].length; c++) {
          if (starPattern[r][c]) {
            ctx.fillRect(cx - 5 * sp / 2 + c * sp, cy - 5 * sp / 2 + r * sp, sp, sp);
          }
        }
      }
    };

    // ---------- MAIN DRAW ----------
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
        g.groundX = (g.groundX + GROUND_SPEED) % 18;

        // Spawn pipes
        if (g.frameCount % 110 === 0) {
          const minTop = 70;
          const maxTop = groundY - PIPE_GAP - 70;
          const topH = minTop + Math.random() * (maxTop - minTop);
          g.pipes.push({ x: W, topH, scored: false });
        }

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
        const birdBot = g.birdY + BIRD_H / 2;
        const birdL = BIRD_X - BIRD_W / 2 + 4;
        const birdR = BIRD_X + BIRD_W / 2 - 2;

        if (birdBot > groundY) {
          g.birdY = groundY - BIRD_H / 2;
          g.state = "dead";
          g.highScore = Math.max(g.highScore, g.score);
          g.flashAlpha = 1;
          spawnDeathParticles(BIRD_X, g.birdY);
        }
        if (birdTop < 0) {
          g.birdY = BIRD_H / 2;
          g.velocity = 0;
        }

        for (const pipe of g.pipes) {
          if (birdR > pipe.x && birdL < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topH || birdBot > pipe.topH + PIPE_GAP) {
              g.state = "dead";
              g.highScore = Math.max(g.highScore, g.score);
              g.flashAlpha = 1;
              spawnDeathParticles(BIRD_X, g.birdY);
            }
          }
        }
      }

      if (g.state === "dead") {
        g.deadTimer++;
        g.flashAlpha *= 0.9;
        g.shakeX = g.deadTimer < 8 ? (Math.random() - 0.5) * 6 : 0;
        g.shakeY = g.deadTimer < 8 ? (Math.random() - 0.5) * 6 : 0;

        if (g.birdY < groundY - BIRD_H / 2) {
          g.velocity += GRAVITY;
          if (g.velocity > MAX_FALL_SPEED) g.velocity = MAX_FALL_SPEED;
          g.birdY += g.velocity;
          if (g.birdY > groundY - BIRD_H / 2) g.birdY = groundY - BIRD_H / 2;
        }

        // Update particles
        for (const p of g.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.life--;
        }
        g.particles = g.particles.filter((p) => p.life > 0);
      }

      if (g.state === "idle") {
        g.birdY = groundY * 0.4 + Math.sin(Date.now() / 300) * 10;
        g.flapFrame = Math.floor(Date.now() / 120) % 10;
        g.groundX = (Date.now() / 12) % 18;
      }

      // --- Render ---
      ctx.save();
      if (g.state === "dead" && g.deadTimer < 8) {
        ctx.translate(g.shakeX, g.shakeY);
      }

      drawSky(ctx, W, H);

      const scrollOffset = g.state === "idle" ? Date.now() / 30 : g.frameCount;
      drawClouds(ctx, W, H, scrollOffset);
      drawHills(ctx, W, H, scrollOffset);

      for (const pipe of g.pipes) {
        drawPipe(ctx, pipe, H);
      }

      drawGround(ctx, W, H, g.groundX);
      drawBird(ctx, BIRD_X, g.birdY, g.state === "idle" ? -1.5 : g.velocity, g.flapFrame, g.state === "dead");

      // Particles
      if (g.particles.length > 0) {
        drawParticles(ctx);
      }

      // Score
      if (g.state === "playing") {
        drawScore(ctx, W, g.score);
      }

      // Death flash
      if (g.flashAlpha > 0.01) {
        ctx.fillStyle = `rgba(255, 255, 255, ${g.flashAlpha})`;
        ctx.fillRect(-10, -10, W + 20, H + 20);
      }

      ctx.restore();

      // --- UI overlays (no shake) ---

      // Idle
      if (g.state === "idle") {
        // Title
        drawFlappyText(ctx, "Flappy Bird", W / 2, H * 0.14, 42, "#f8c53a", "#543847", 5);

        // Tap prompt
        const pulse = 0.6 + Math.sin(Date.now() / 300) * 0.4;
        ctx.globalAlpha = pulse;
        drawFlappyText(ctx, "Tap to Start", W / 2, groundY - 35, 24, "#ffffff", "#543847", 4);
        ctx.globalAlpha = 1;

        // Controls hint
        ctx.globalAlpha = 0.55;
        drawFlappyText(ctx, "Space / Click / Tap", W / 2, groundY - 10, 14, "#ffffff", "#543847", 2);
        ctx.globalAlpha = 1;
      }

      // Game Over
      if (g.state === "dead" && g.deadTimer > 15) {
        const panelW = Math.min(240, W - 40);
        const panelH = 140;
        const px = (W - panelW) / 2;
        const py = H * 0.18;

        // Fade in
        const fadeIn = Math.min((g.deadTimer - 15) / 10, 1);
        ctx.globalAlpha = fadeIn;

        // "Game Over"
        drawFlappyText(ctx, "Game Over", W / 2, py - 2, 36, "#fc3e3e", "#543847", 5);

        // Panel — rounded with border
        ctx.fillStyle = "#deb960";
        roundRect(ctx, px - 3, py + 20, panelW + 6, panelH + 6, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(80, 50, 20, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#c8a84e";
        roundRect(ctx, px + 5, py + 28, panelW - 10, panelH - 10, 5);
        ctx.fill();

        // Score label + value
        ctx.textAlign = "left";
        drawFlappyText(ctx, "Score", px + 70, py + 52, 20, "#ffffff", "#8b6914", 3);
        ctx.textAlign = "right";
        drawFlappyText(ctx, String(g.score), px + panelW - 16, py + 52, 28, "#ffffff", "#543847", 3);

        // Best label + value
        ctx.textAlign = "left";
        drawFlappyText(ctx, "Best", px + 70, py + 100, 20, "#ffffff", "#8b6914", 3);
        ctx.textAlign = "right";
        drawFlappyText(ctx, String(g.highScore), px + panelW - 16, py + 100, 28, "#ffffff", "#543847", 3);

        // Reset alignment
        ctx.textAlign = "center";

        // Medal
        drawMedal(ctx, px + 38, py + 78, g.score);

        // Retry
        if (g.deadTimer > 25) {
          const pulse = 0.5 + Math.sin(Date.now() / 300) * 0.5;
          ctx.globalAlpha = fadeIn * pulse;
          drawFlappyText(ctx, "Tap to Retry", W / 2, py + panelH + 45, 24, "#ffffff", "#543847", 4);
        }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [spawnDeathParticles]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-pointer select-none touch-none overflow-hidden"
      onMouseDown={(e) => { e.stopPropagation(); jump(); }}
      onTouchStart={(e) => { e.stopPropagation(); jump(); }}
      tabIndex={0}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
