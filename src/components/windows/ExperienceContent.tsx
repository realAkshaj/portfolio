"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } };

export function ExperienceContent() {
  return (
    <motion.div className="relative pl-6" variants={container} initial="hidden" animate="show">
      <div className="absolute bottom-2 left-[6px] top-2 w-px bg-white/[0.08]" />

      {experiences.map((exp) => (
        <motion.div key={exp.company} variants={item} className="relative mb-7">
          <div className="absolute -left-[20px] top-1.5 z-[1] h-2.5 w-2.5 rounded-full border-2 border-crust"
            style={{ backgroundColor: exp.color }} />
          <h3 className="text-[15px] font-semibold text-white">{exp.role}</h3>
          <p className="text-[13px] text-accent-blue">
            {exp.company}
            {exp.location && <span className="text-text-dim"> · {exp.location}</span>}
          </p>
          <p className="mb-2 text-[11px] text-text-dim">{exp.date}</p>
          <p className="text-[13px] leading-[1.7] text-text-dim">{exp.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
