"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

export function ExperienceContent() {
  return (
    <motion.div className="relative pl-6" variants={container} initial="hidden" animate="show">
      <div className="absolute bottom-2 left-[6px] top-2 w-px bg-white/[0.06]" />

      {experiences.map((exp) => (
        <motion.div key={exp.company} variants={item} className="relative mb-7">
          <div className="absolute -left-[20px] top-1.5 z-[1] h-2.5 w-2.5 rounded-full border-2 border-deep bg-accent" />
          <h3 className="font-display text-sm font-600 tracking-tight text-primary">{exp.role}</h3>
          <p className="font-mono text-[12px] text-accent">
            {exp.company}
            {exp.location && <span className="text-tertiary"> · {exp.location}</span>}
          </p>
          <p className="mb-2.5 font-mono text-[11px] text-tertiary">{exp.date}</p>
          <p className="mb-2.5 font-mono text-[12px] leading-[1.7] text-secondary">{exp.summary}</p>
          <ul className="space-y-1.5">
            {exp.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 font-mono text-[11px] leading-[1.7] text-secondary">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/30" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
