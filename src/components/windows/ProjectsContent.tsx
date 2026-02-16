"use client";

import { motion } from "framer-motion";
import { projects, Project } from "@/data/portfolio";

const tagColorMap: Record<Project["tagColor"], string> = {
  ai: "bg-accent-mauve/15 text-accent-mauve",
  systems: "bg-accent-blue/15 text-accent-blue",
  web: "bg-accent-green/15 text-accent-green",
  security: "bg-accent-red/15 text-accent-red",
  impact: "bg-accent-teal/15 text-accent-teal",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function ProjectsContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {projects.map((project) => (
        <motion.div key={project.name} variants={item}
          className="mb-4 cursor-default rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-accent-blue/30 hover:bg-white/[0.05]">
          <div className="mb-2.5 flex items-start justify-between">
            <h3 className="text-base font-semibold text-white">{project.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${tagColorMap[project.tagColor]}`}>
              {project.tag}
            </span>
          </div>
          <p className="mb-3 text-[13px] leading-relaxed text-text-dim">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span key={tech} className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-dim">{tech}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
