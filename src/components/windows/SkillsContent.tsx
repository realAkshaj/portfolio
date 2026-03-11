"use client";

import { motion } from "framer-motion";
import { skills, expertiseAreas } from "@/data/portfolio";

export function SkillsContent() {
  return (
    <div className="font-mono">
      <div className="mb-1 text-[12px]">
        <span className="text-accent">akshaj@portfolio</span>
        <span className="text-tertiary">:</span>
        <span className="text-accent/60">~</span>
        <span className="text-primary/80">$ cat skills.json</span>
      </div>
      <br />
      <p className="mb-4 text-[11px] tracking-wider text-tertiary">{"// Technical Proficiency"}</p>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={skill.name}>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-primary/80">{skill.name}</span>
              <span className="text-tertiary">{skill.level}%</span>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full bg-accent"
                style={{ opacity: 0.4 + (skill.level / 100) * 0.6 }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <div className="mb-1 text-[12px]">
          <span className="text-accent">akshaj@portfolio</span>
          <span className="text-tertiary">:</span>
          <span className="text-accent/60">~</span>
          <span className="text-primary/80">$ echo $EXPERTISE</span>
        </div>
        <br />
        <p className="mb-3 text-[11px] tracking-wider text-tertiary">{"// Core Domains"}</p>
        {expertiseAreas.map((area, i) => (
          <motion.div key={area} className="text-[12px]"
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.05 }}>
            <span className="text-accent/60">{"  > "}</span>
            <span className="text-secondary">{area}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-7 text-[12px]">
        <span className="text-accent">akshaj@portfolio</span>
        <span className="text-tertiary">:</span>
        <span className="text-accent/60">~</span>
        <span className="text-primary/80">$ </span>
        <span className="animate-blink text-accent">_</span>
      </div>
    </div>
  );
}
