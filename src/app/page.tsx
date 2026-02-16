"use client";

import { useState, useEffect, useCallback } from "react";
import { BootScreen } from "@/components/desktop/BootScreen";
import { MatrixRain } from "@/components/desktop/MatrixRain";
import { MenuBar } from "@/components/desktop/MenuBar";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { Dock } from "@/components/desktop/Dock";
import { CommandPalette } from "@/components/desktop/CommandPalette";
import { ContextMenu } from "@/components/desktop/ContextMenu";
import { Notifications } from "@/components/desktop/Notifications";
import { Window } from "@/components/ui/Window";
import { AboutContent } from "@/components/windows/AboutContent";
import { ProjectsContent } from "@/components/windows/ProjectsContent";
import { SkillsContent } from "@/components/windows/SkillsContent";
import { ExperienceContent } from "@/components/windows/ExperienceContent";
import { EducationContent } from "@/components/windows/EducationContent";
import { ContactContent } from "@/components/windows/ContactContent";
import { FlappyGame } from "@/components/windows/FlappyGame";
import { ResumeContent } from "@/components/windows/ResumeContent";
import { TerminalContent } from "@/components/windows/TerminalContent";
import { useSounds } from "@/hooks/use-sounds";
import { useWindowStore } from "@/store/window-store";

export default function Home() {
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState("linear-gradient(135deg, #16213e 0%, #0f3460 40%, #533483 100%)");
  const { playBoot, playOpen, playClose, muted, setMuted } = useSounds();
  const booted = useWindowStore((s) => s.booted);

  const openPalette = useCallback(() => setCmdPaletteOpen(true), []);
  const closePalette = useCallback(() => setCmdPaletteOpen(false), []);

  // Boot chime
  useEffect(() => {
    if (booted) playBoot();
  }, [booted, playBoot]);

  // Sound effects on window open/close
  useEffect(() => {
    const unsub = useWindowStore.subscribe((state, prev) => {
      for (const key of Object.keys(state.windows) as (keyof typeof state.windows)[]) {
        if (state.windows[key].isOpen && !prev.windows[key].isOpen) {
          playOpen();
          return;
        }
        if (!state.windows[key].isOpen && prev.windows[key].isOpen) {
          playClose();
          return;
        }
      }
    });
    return unsub;
  }, [playOpen, playClose]);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <BootScreen />
      <div className="wallpaper fixed inset-0 overflow-hidden" style={{ background: wallpaper }}>
        <MatrixRain />
        <MenuBar
          onCommandPalette={openPalette}
          muted={muted}
          onToggleMute={() => setMuted(!muted)}
        />
        <DesktopIcons />
        <Notifications />

        <Window id="about" title="About Me"><AboutContent /></Window>
        <Window id="projects" title="Projects — ~/dev"><ProjectsContent /></Window>
        <Window id="skills" title="Terminal — skills.sh"><SkillsContent /></Window>
        <Window id="experience" title="Experience"><ExperienceContent /></Window>
        <Window id="education" title="Education"><EducationContent /></Window>
        <Window id="contact" title="Contact"><ContactContent /></Window>
        <Window id="resume" title="Resume"><ResumeContent /></Window>
        <Window id="terminal" title="Terminal"><TerminalContent /></Window>
        <Window id="game" title="Flappy Bird"><FlappyGame /></Window>

        <Dock />
        <CommandPalette isOpen={cmdPaletteOpen} onClose={closePalette} />
        <ContextMenu onWallpaperChange={setWallpaper} />
      </div>
    </>
  );
}
