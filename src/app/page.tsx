"use client";

import { BootScreen } from "@/components/desktop/BootScreen";
import { MenuBar } from "@/components/desktop/MenuBar";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { Dock } from "@/components/desktop/Dock";
import { Window } from "@/components/ui/Window";
import { AboutContent } from "@/components/windows/AboutContent";
import { ProjectsContent } from "@/components/windows/ProjectsContent";
import { SkillsContent } from "@/components/windows/SkillsContent";
import { ExperienceContent } from "@/components/windows/ExperienceContent";
import { EducationContent } from "@/components/windows/EducationContent";
import { ContactContent } from "@/components/windows/ContactContent";

export default function Home() {
  return (
    <>
      <BootScreen />
      <div className="wallpaper fixed inset-0 overflow-hidden">
        <div className="wallpaper-grid" />
        <MenuBar />
        <DesktopIcons />

        <Window id="about" title="About Me"><AboutContent /></Window>
        <Window id="projects" title="Projects — ~/dev"><ProjectsContent /></Window>
        <Window id="skills" title="Terminal — skills.sh"><SkillsContent /></Window>
        <Window id="experience" title="Experience"><ExperienceContent /></Window>
        <Window id="education" title="Education"><EducationContent /></Window>
        <Window id="contact" title="Contact"><ContactContent /></Window>

        <Dock />
      </div>
    </>
  );
}
