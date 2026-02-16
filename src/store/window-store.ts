import { create } from "zustand";

export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type WindowId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "contact"
  | "game"
  | "resume"
  | "terminal";

interface WindowStore {
  windows: Record<WindowId, WindowState>;
  topZIndex: number;
  booted: boolean;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, x: number, y: number) => void;
  updateSize: (id: WindowId, width: number, height: number) => void;
  setBoot: (booted: boolean) => void;
}

const defaultWindows: Record<WindowId, WindowState> = {
  about: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 80, y: 60 }, size: { width: 680, height: 520 },
  },
  projects: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 150, y: 80 }, size: { width: 700, height: 540 },
  },
  skills: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 200, y: 70 }, size: { width: 600, height: 480 },
  },
  experience: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 120, y: 90 }, size: { width: 640, height: 480 },
  },
  education: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 180, y: 100 }, size: { width: 580, height: 420 },
  },
  contact: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 220, y: 80 }, size: { width: 520, height: 400 },
  },
  game: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 100, y: 50 }, size: { width: 420, height: 600 },
  },
  resume: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 100, y: 50 }, size: { width: 650, height: 550 },
  },
  terminal: {
    isOpen: false, isMaximized: false, zIndex: 1,
    position: { x: 140, y: 60 }, size: { width: 620, height: 450 },
  },
};

export const useWindowStore = create<WindowStore>((set) => ({
  windows: defaultWindows,
  topZIndex: 1,
  booted: false,

  openWindow: (id) =>
    set((state) => ({
      topZIndex: state.topZIndex + 1,
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: true, zIndex: state.topZIndex + 1 },
      },
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false, isMaximized: false },
      },
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized },
      },
    })),

  focusWindow: (id) =>
    set((state) => ({
      topZIndex: state.topZIndex + 1,
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: state.topZIndex + 1 },
      },
    })),

  updatePosition: (id, x, y) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position: { x, y } },
      },
    })),

  updateSize: (id, width, height) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size: {
            width: Math.max(320, width),
            height: Math.max(200, height),
          },
        },
      },
    })),

  setBoot: (booted) => set({ booted }),
}));
