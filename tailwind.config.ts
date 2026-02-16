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
        base: "#1e1e2e",
        mantle: "#181825",
        crust: "#11111b",
        surface: {
          0: "#313244",
          1: "#45475a",
          2: "#585b70",
        },
        text: {
          DEFAULT: "#cdd6f4",
          dim: "#a6adc8",
          bright: "#ffffff",
        },
        accent: {
          blue: "#89b4fa",
          green: "#a6e3a1",
          red: "#f38ba8",
          yellow: "#f9e2af",
          peach: "#fab387",
          mauve: "#cba6f7",
          teal: "#94e2d5",
          pink: "#f5c2e7",
          sky: "#89dceb",
        },
      },
      fontFamily: {
        mono: ["var(--font-share-tech)", "monospace"],
        body: ["var(--font-share-tech)", "monospace"],
        display: ["var(--font-orbitron)", "sans-serif"],
      },
      animation: {
        "window-open": "windowOpen 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "boot-fill": "bootFill 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        windowOpen: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bootFill: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
