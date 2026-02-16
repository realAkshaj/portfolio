"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { ExternalLink } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function AboutContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-7 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-blue to-accent-mauve text-4xl font-bold text-crust shadow-lg shadow-accent-blue/20 md:h-[100px] md:w-[100px]">
          {personalInfo.initials}
        </div>
        <div className="text-center md:text-left">
          <h1 className="mb-1 font-display text-2xl font-bold uppercase tracking-wider text-white">{personalInfo.name}</h1>
          <p className="mb-2 text-sm text-accent-blue">{personalInfo.title}</p>
          <p className="text-xs text-text-dim">{personalInfo.location}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-6">
        {personalInfo.bio.map((p, i) => (
          <p key={i} className="mb-3 text-[13px] leading-[1.8] text-text last:mb-0">{p}</p>
        ))}
      </motion.div>

      <motion.div variants={item} className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {personalInfo.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
            <div className="mb-1 text-xl font-bold text-accent-blue">{stat.value}</div>
            <div className="text-[11px] uppercase tracking-wider text-text-dim">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-2.5">
        {[
          { label: "GitHub", href: personalInfo.links.github },
          { label: "LinkedIn", href: personalInfo.links.linkedin },
          { label: "Email", href: `mailto:${personalInfo.links.email}` },
        ].map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-text transition-all hover:border-accent-blue hover:bg-accent-blue/[0.08] hover:text-accent-blue">
            <ExternalLink size={12} /> {link.label}
          </a>
        ))}
      </motion.div>
    </motion.div>
  );
}
