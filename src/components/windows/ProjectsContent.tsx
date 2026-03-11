"use client";

import { motion } from "framer-motion";
import { projects, Project } from "@/data/portfolio";

const tagColorMap: Record<Project["tagColor"], string> = {
  ai: "text-accent",
  systems: "text-primary/70",
  web: "text-semantic-green",
  security: "text-semantic-red",
  impact: "text-accent/80",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export function ProjectsContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {projects.map((project) => (
        <motion.div key={project.name} variants={item}
          className="mb-4 cursor-default rounded-xl border-l-2 border-l-accent/30 border border-white/[0.04] bg-white/[0.02] p-5 transition-all hover:border-l-accent/60 hover:bg-white/[0.03]">
          <div className="mb-2.5 flex items-start justify-between">
            <h3 className="font-display text-sm font-600 tracking-tight text-primary">{project.name}</h3>
            <span className={`font-mono text-[10px] tracking-wider ${tagColorMap[project.tagColor]}`}>
              {project.tag}
            </span>
          </div>
          <p className="mb-3 font-mono text-[12px] leading-relaxed text-secondary">{project.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-tertiary">{tech}</span>
              ))}
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="ml-3 shrink-0 rounded-lg border border-accent/20 bg-accent/[0.04] px-3 py-1 font-mono text-[11px] text-accent transition-all hover:border-accent/40 hover:bg-accent/[0.08]">
                View &rarr;
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
