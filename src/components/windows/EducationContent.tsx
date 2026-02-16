"use client";

import { motion } from "framer-motion";
import { education } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function EducationContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {education.map((edu) => (
        <motion.div key={edu.school} variants={item}
          className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h3 className="mb-1 font-display text-sm font-semibold uppercase tracking-wide text-white">{edu.degree}</h3>
          <p className="mb-1 text-[13px] text-accent-blue">{edu.school}</p>
          <p className="mb-2.5 text-xs text-text-dim">{edu.date}</p>
          <p className="text-[13px] leading-[1.7] text-text-dim">{edu.details}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
