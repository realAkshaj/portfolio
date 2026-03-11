"use client";

import { motion } from "framer-motion";
import { education } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export function EducationContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {education.map((edu) => (
        <motion.div key={edu.school} variants={item}
          className="mb-4 rounded-xl border-l-2 border-l-accent/30 border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="mb-1 font-display text-sm font-600 tracking-tight text-primary">{edu.degree}</h3>
          <p className="mb-1 font-mono text-[12px] text-accent">{edu.school}</p>
          <p className="mb-2.5 font-mono text-[11px] text-tertiary">{edu.date}</p>
          <p className="font-mono text-[12px] leading-[1.7] text-secondary">{edu.details}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
