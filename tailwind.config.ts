import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: "#0C0C0C",
        base: "#141414",
        surface: "#1C1C1C",
        raised: "#242424",
        subtle: "#2E2E2E",
        primary: "#E8E4DF",
        secondary: "#8A8580",
        tertiary: "#5C5955",
        accent: {
          DEFAULT: "#C9A96E",
          dim: "#A68B52",
          glow: "rgba(201, 169, 110, 0.15)",
        },
        semantic: {
          green: "#7A9F7A",
          red: "#B56B5E",
          yellow: "#C4A84E",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      animation: {
        "window-open": "windowOpen 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "line-draw": "lineDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        windowOpen: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        lineDraw: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
