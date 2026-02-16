"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { personalInfo, skills, experiences, education, projects } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export function ResumeContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="font-mono text-[13px]">
      {/* Header */}
      <motion.div variants={item} className="mb-5 border-b border-white/[0.08] pb-4 text-center">
        <h1 className="mb-1 font-display text-xl font-bold uppercase tracking-wider text-white">
          {personalInfo.name}
        </h1>
        <p className="mb-2 text-sm text-accent-blue">{personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-3 text-[11px] text-text-dim">
          <span>{personalInfo.location}</span>
          <span>|</span>
          <span>{personalInfo.links.email}</span>
          <span>|</span>
          <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
            GitHub
          </a>
          <span>|</span>
          <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
            LinkedIn
          </a>
        </div>
      </motion.div>

      {/* Education */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-accent-mauve">Education</h2>
        {education.map((edu) => (
          <div key={edu.school} className="mb-2">
            <div className="flex justify-between">
              <span className="font-semibold text-white">{edu.degree}</span>
              <span className="text-text-dim">{edu.date}</span>
            </div>
            <p className="text-text-dim">{edu.school}</p>
            <p className="mt-0.5 text-[12px] text-text-dim/70">{edu.details}</p>
          </div>
        ))}
      </motion.div>

      {/* Experience */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-accent-mauve">Experience</h2>
        {experiences.map((exp) => (
          <div key={exp.company} className="mb-3">
            <div className="flex justify-between">
              <span className="font-semibold text-white">{exp.role}</span>
              <span className="text-text-dim">{exp.date}</span>
            </div>
            <p className="text-accent-blue">
              {exp.company}
              {exp.location && <span className="text-text-dim"> — {exp.location}</span>}
            </p>
            <p className="mt-1 leading-relaxed text-text-dim">{exp.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Projects */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-accent-mauve">Projects</h2>
        {projects.slice(0, 3).map((proj) => (
          <div key={proj.name} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{proj.name}</span>
              <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-text-dim">{proj.tag}</span>
            </div>
            <p className="text-text-dim">{proj.description}</p>
            <p className="mt-0.5 text-[11px] text-accent-blue">{proj.tech.join(" · ")}</p>
          </div>
        ))}
      </motion.div>

      {/* Skills */}
      <motion.div variants={item} className="mb-5">
        <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-accent-mauve">Technical Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill.name} className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-text-dim">
              {skill.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Download button */}
      <motion.div variants={item} className="flex justify-center gap-3 border-t border-white/[0.08] pt-4">
        <a
          href="https://drive.google.com/file/d/1Ff9iWJJRu9jcSKh-Zixmy6gNN8GaO5b1/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-accent-blue/30 bg-accent-blue/10 px-5 py-2.5 text-xs font-medium text-accent-blue transition-all hover:bg-accent-blue/20"
        >
          <ExternalLink size={14} />
          View Full Resume
        </a>
      </motion.div>
    </motion.div>
  );
}
