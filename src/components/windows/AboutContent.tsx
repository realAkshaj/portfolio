"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { ExternalLink } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export function AboutContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.06] font-display text-3xl font-700 text-accent md:h-[96px] md:w-[96px]">
          {personalInfo.initials}
        </div>
        <div className="text-center md:text-left">
          <h1 className="mb-1.5 font-display text-2xl font-700 tracking-tight text-primary">{personalInfo.name}</h1>
          <p className="mb-2 font-mono text-sm text-accent">{personalInfo.title}</p>
          <p className="font-mono text-xs text-tertiary">{personalInfo.location}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-7">
        {personalInfo.bio.map((p, i) => (
          <p key={i} className="mb-3 font-mono text-[13px] leading-[1.9] text-secondary last:mb-0">{p}</p>
        ))}
      </motion.div>

      <motion.div variants={item} className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3">
        {personalInfo.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border-l-2 border-l-accent/40 border border-white/[0.04] bg-white/[0.02] p-4 text-center">
            <div className="mb-1 font-display text-xl font-700 text-accent">{stat.value}</div>
            <div className="font-mono text-[10px] tracking-wider text-tertiary">{stat.label}</div>
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-2 font-mono text-xs text-secondary transition-all hover:border-accent/30 hover:bg-accent/[0.04] hover:text-accent">
            <ExternalLink size={11} /> {link.label}
          </a>
        ))}
      </motion.div>
    </motion.div>
  );
}
