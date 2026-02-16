"use client";

import { motion } from "framer-motion";
import { skills, expertiseAreas } from "@/data/portfolio";

export function SkillsContent() {
  return (
    <div className="font-mono">
      <div className="mb-1 text-[13px]">
        <span className="text-accent-green">akshaj@portfolio</span>
        <span className="text-text-dim">:</span>
        <span className="text-accent-blue">~</span>
        <span className="text-white">$ cat skills.json</span>
      </div>
      <br />
      <p className="mb-3 text-[13px] text-text-dim">{"// ═══ Technical Proficiency ═══"}</p>

      <div className="space-y-2.5">
        {skills.map((skill, index) => (
          <div key={skill.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-text">{skill.name}</span>
              <span className="text-text-dim">{skill.level}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-1 text-[13px]">
          <span className="text-accent-green">akshaj@portfolio</span>
          <span className="text-text-dim">:</span>
          <span className="text-accent-blue">~</span>
          <span className="text-white">$ echo $EXPERTISE</span>
        </div>
        <br />
        <p className="mb-3 text-[13px] text-text-dim">{"// ═══ Core Domains ═══"}</p>
        {expertiseAreas.map((area, i) => (
          <motion.div key={area} className="text-[13px]"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.06 }}>
            <span className="text-accent-green">{"  ▸ "}</span>
            <span className="text-text-dim">{area}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-[13px]">
        <span className="text-accent-green">akshaj@portfolio</span>
        <span className="text-text-dim">:</span>
        <span className="text-accent-blue">~</span>
        <span className="text-white">$ </span>
        <span className="animate-blink text-white">█</span>
      </div>
    </div>
  );
}
