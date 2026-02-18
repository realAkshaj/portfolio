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

    // --- Pixel grid size ---
    const P = 4; // base pixel block size

    // Snap a value to the pixel grid
    const snap = (v: number) => Math.round(v / P) * P;

    // --- Render helpers ---

    const drawSky = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const groundY = H - GROUND_H;
      // Banded sky in pixel rows
      const bands = ["#70c5ce", "#7ecad3", "#8dd0d8", "#9bd6dd", "#aadce2", "#c0e8ec", "#d5f0f0"];
      const bandH = Math.ceil(groundY / bands.length);
      for (let i = 0; i < bands.length; i++) {
        ctx.fillStyle = bands[i];
        ctx.fillRect(0, i * bandH, W, bandH + 1);
      }
    };

    const drawClouds = (ctx: CanvasRenderingContext2D, W: number, _H: number, offset: number) => {
      // Blocky pixel clouds — each defined as rows of [startCol, width]
      const cloudShapes = [
        { rows: [[2,4],[1,6],[0,8],[0,8],[1,6]], baseX: 30, y: 30 },
        { rows: [[1,3],[0,5],[0,5],[1,3]], baseX: 250, y: 55 },
        { rows: [[3,3],[1,7],[0,10],[0,10],[1,8],[2,6]], baseX: 450, y: 22 },
        { rows: [[1,4],[0,6],[0,6],[1,4]], baseX: 620, y: 48 },
      ];
      for (const cloud of cloudShapes) {
        const bx = snap(((cloud.baseX - offset * 0.12) % (W + 200) + W + 200) % (W + 200) - 80);
        for (let r = 0; r < cloud.rows.length; r++) {
          const [sc, w] = cloud.rows[r];
          // White block
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(bx + sc * P, cloud.y + r * P, w * P, P);
          // Slight highlight on top row
          if (r === 0) {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(bx + sc * P, cloud.y + r * P, w * P, P);
          }
        }
        // Bottom shadow
        const lastRow = cloud.rows[cloud.rows.length - 1];
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(bx + lastRow[0] * P, cloud.y + cloud.rows.length * P, lastRow[1] * P, P);
      }
    };

    // Far background — stepped blocky hills
    const drawHills = (ctx: CanvasRenderingContext2D, W: number, H: number, offset: number) => {
      const groundY = H - GROUND_H;
      // Back hills
      ctx.fillStyle = "rgba(90, 170, 90, 0.25)";
      for (let x = 0; x < W; x += P) {
        const h = 25 + Math.sin((x + offset * 0.25) * 0.01) * 18 + Math.sin((x + offset * 0.25) * 0.02) * 8;
        const sh = snap(h);
        ctx.fillRect(x, groundY - sh, P, sh);
      }
      // Front hills
      ctx.fillStyle = "rgba(70, 150, 70, 0.3)";
      for (let x = 0; x < W; x += P) {
        const h = 14 + Math.sin((x + offset * 0.5 + 80) * 0.015) * 12 + Math.sin((x + offset * 0.5) * 0.025) * 6;
        const sh = snap(h);
        ctx.fillRect(x, groundY - sh, P, sh);
      }
    };

    const drawGround = (ctx: CanvasRenderingContext2D, W: number, H: number, groundX: number) => {
      const groundY = H - GROUND_H;

      // Dirt fill
      ctx.fillStyle = "#ded895";
      ctx.fillRect(0, groundY, W, GROUND_H);

      // Darker dirt band
      ctx.fillStyle = "#d2c878";
      ctx.fillRect(0, groundY + P * 4, W, GROUND_H - P * 4);

      // Green grass — 3 pixel rows
      ctx.fillStyle = "#5ec941";
      ctx.fillRect(0, groundY, W, P * 3);
      // Highlight top
      ctx.fillStyle = "#73d456";
      ctx.fillRect(0, groundY, W, P);
      // Dark edge
      ctx.fillStyle = "#4aaa34";
      ctx.fillRect(0, groundY + P * 3, W, P);

      // Pixelated dirt pattern — checkerboard
      const gx = snap(groundX);
      ctx.fillStyle = "rgba(160, 140, 70, 0.2)";
      for (let x = -P * 2 + (gx % (P * 2)); x < W + P * 2; x += P * 2) {
        for (let row = 0; row < 3; row++) {
          const offsetRow = row % 2 === 0 ? 0 : P;
          ctx.fillRect(x + offsetRow, groundY + P * 5 + row * P * 2, P, P);
        }
      }
    };

    const drawPipeSection = (
      ctx: CanvasRenderingContext2D,
      x: number, y: number, w: number, h: number,
      isCap: boolean,
    ) => {
      const sx = snap(x);
      const sy = snap(y);
      const sw = snap(w);
      const sh = snap(h);

      // Main body
      ctx.fillStyle = "#73bf2e";
      ctx.fillRect(sx, sy, sw, sh);

      // Left highlight column
      ctx.fillStyle = "#8ed64a";
      ctx.fillRect(sx, sy, P, sh);
      ctx.fillStyle = "#82cc40";
      ctx.fillRect(sx + P, sy, P, sh);

      // Right shadow column
      ctx.fillStyle = "#5a9e1c";
      ctx.fillRect(sx + sw - P, sy, P, sh);
      ctx.fillStyle = "#63a922";
      ctx.fillRect(sx + sw - P * 2, sy, P, sh);

      // Top/bottom pixel edge for caps
      if (isCap) {
        ctx.fillStyle = "#8ed64a";
        ctx.fillRect(sx, sy, sw, P);
        ctx.fillStyle = "#5a9e1c";
        ctx.fillRect(sx, sy + sh - P, sw, P);
      }

      // Outline
      ctx.strokeStyle = "#3d7a12";
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, sw, sh);
    };

    const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, H: number) => {
      const capH = snap(26);
      const capOv = P;
      const groundY = H - GROUND_H;

      // Top pipe body
      drawPipeSection(ctx, pipe.x, 0, PIPE_WIDTH, pipe.topH - capH, false);
      // Top pipe cap
      drawPipeSection(ctx, pipe.x - capOv, pipe.topH - capH, PIPE_WIDTH + capOv * 2, capH, true);

      // Bottom pipe cap
      const bottomY = pipe.topH + PIPE_GAP;
      drawPipeSection(ctx, pipe.x - capOv, bottomY, PIPE_WIDTH + capOv * 2, capH, true);
      // Bottom pipe body
      drawPipeSection(ctx, pipe.x, bottomY + capH, PIPE_WIDTH, groundY - bottomY - capH, false);
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

    // Pixel-art bird — classic Flappy Bird icon style
    const BP = 4; // 4px per pixel — chunky and visible

    const cm: Record<string, string> = {
      Y: "#f8c53a",   // main yellow body
      L: "#fae48b",   // light yellow highlight
      D: "#dca817",   // darker yellow underside
      W: "#ffffff",   // eye white
      B: "#000000",   // pupil
      R: "#e8652a",   // beak top (red-orange)
      r: "#cc4422",   // beak bottom (darker)
      K: "#e0a820",   // wing mid
      k: "#c89020",   // wing dark
    };

    // 13 cols x 10 rows — no outline baked in, outline drawn programmatically
    const birdMid = [
      "   YYYY      ",
      "  LLLLYYY    ",
      " LLLLYYYY WW ",
      " LLYYYYYY WBW",
      "YYYYYYYYYY WW",
      "YYYYYYYRRRr  ",
      "YkYYYYRRRRr  ",
      " kkYYYY Rr   ",
      "  DYYYYY     ",
      "   DYYY      ",
    ];

    const birdWingDown = [
      "   YYYY      ",
      "  LLLLYYY    ",
      " LLLLYYYY WW ",
      " LLYYYYYY WBW",
      "YYYYYYYYYY WW",
      "YYYYYYYRRRr  ",
      "YYYYYYRRRRr  ",
      " YKYYYy Rr   ",
      "  kkYYYY     ",
      "   DYYY      ",
    ];

    const birdWingUp = [
      "  kYYYY      ",
      "  KLLLLYYY   ",
      " YLLLLYYYY WW",
      " LLYYYYYY WBW",
      "YYYYYYYYYY WW",
      "YYYYYYYRRRr  ",
      "YYYYYYRRRRr  ",
      " YYYYYy Rr   ",
      "  DYYYYY     ",
      "   DYYY      ",
    ];

    const parseSpriteRow = (row: string): string[] => row.split("");

    const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, velocity: number, flapFrame: number, isDead: boolean) => {
      ctx.save();
      ctx.translate(snap(x), snap(y));

      let angle: number;
      if (isDead) {
        angle = Math.min(game.current.deadTimer * 0.08, Math.PI / 2);
      } else {
        angle = velocity * 0.06;
        angle = Math.max(-0.4, Math.min(angle, 1.2));
      }
      ctx.rotate(angle);

      const wingCycle = flapFrame % 15;
      const sprite = wingCycle < 5 ? birdWingUp : wingCycle < 10 ? birdMid : birdWingDown;
      const rows = sprite.length;
      const cols = sprite[0].length;
      const ox = -(cols * BP) / 2;
      const oy = -(rows * BP) / 2;

      // 1) Dark outline pass — draw slightly larger behind each filled pixel
      for (let r = 0; r < rows; r++) {
        const pixels = parseSpriteRow(sprite[r]);
        for (let c = 0; c < pixels.length; c++) {
          if (pixels[c] && pixels[c] !== " ") {
            ctx.fillStyle = "#523a07";
            ctx.fillRect(ox + c * BP - 2, oy + r * BP - 2, BP + 4, BP + 4);
          }
        }
      }

      // 2) Color pass
      for (let r = 0; r < rows; r++) {
        const pixels = parseSpriteRow(sprite[r]);
        for (let c = 0; c < pixels.length; c++) {
          const ch = pixels[c];
          if (!ch || ch === " ") continue;
          ctx.fillStyle = cm[ch] || "#f8c53a";
          ctx.fillRect(ox + c * BP, oy + r * BP, BP, BP);
        }
      }

      // Dead eyes — X over eye
      if (isDead) {
        ctx.fillStyle = "#523a07";
        const ex = ox + 11 * BP;
        const ey = oy + 2 * BP;
        ctx.fillRect(ex, ey, BP, BP);
        ctx.fillRect(ex + 2 * BP, ey, BP, BP);
        ctx.fillRect(ex + BP, ey + BP, BP, BP);
        ctx.fillRect(ex, ey + 2 * BP, BP, BP);
        ctx.fillRect(ex + 2 * BP, ey + 2 * BP, BP, BP);
      }

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
        // Square particles for pixel look
        const s = snap(p.size * alpha * 2) || P;
        ctx.fillRect(snap(p.x) - s / 2, snap(p.y) - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const drawMedal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, score: number) => {
      if (score < 5) return;
      const isGold = score >= 40;
      const isSilver = score >= 20;

      // Blocky medal — pixel circle approximation
      const base = isGold ? "#ffd700" : isSilver ? "#c0c0c0" : "#cd7f32";
      const hi = isGold ? "#fff4a3" : isSilver ? "#e8e8e8" : "#e0a060";
      const sh = isGold ? "#b8960a" : isSilver ? "#888" : "#8a5520";

      // 9x9 pixel circle pattern
      const medalPattern = [
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,0,0],
      ];
      const mp = P;
      const ox = cx - (9 * mp) / 2;
      const oy = cy - (9 * mp) / 2;

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!medalPattern[r][c]) continue;
          ctx.fillStyle = c < 3 ? hi : c > 5 ? sh : base;
          ctx.fillRect(ox + c * mp, oy + r * mp, mp, mp);
        }
      }
      // Outline
      ctx.strokeStyle = sh;
      ctx.lineWidth = 1;

      // Star inside
      const starPattern = [
        [0,0,0,1,0,0,0],
        [0,0,1,1,1,0,0],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,0,1,0,0],
        [0,1,0,0,0,1,0],
      ];
      ctx.fillStyle = isGold ? "#fff" : "rgba(255,255,255,0.85)";
      const sox = cx - (7 * mp) / 2;
      const soy = cy - (6 * mp) / 2;
      for (let r = 0; r < starPattern.length; r++) {
        for (let c = 0; c < starPattern[r].length; c++) {
          if (starPattern[r][c]) {
            ctx.fillRect(sox + c * mp, soy + r * mp, mp, mp);
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
        g.flapFrame = (g.flapFrame + 1) % 15;
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
        g.flapFrame = Math.floor(Date.now() / 120) % 15;
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
