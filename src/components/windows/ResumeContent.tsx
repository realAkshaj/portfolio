"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { personalInfo, skills, experiences, education, projects } from "@/data/portfolio";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function ResumeContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="font-mono text-[12px]">
      {/* Header */}
      <motion.div variants={item} className="mb-5 border-b border-white/[0.04] pb-4 text-center">
        <h1 className="mb-1 font-display text-xl font-700 tracking-tight text-primary">
          {personalInfo.name}
        </h1>
        <p className="mb-2 text-sm text-accent">{personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-3 text-[11px] text-tertiary">
          <span>{personalInfo.location}</span>
          <span className="text-subtle">|</span>
          <span>{personalInfo.links.email}</span>
          <span className="text-subtle">|</span>
          <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            GitHub
          </a>
          <span className="text-subtle">|</span>
          <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            LinkedIn
          </a>
        </div>
      </motion.div>

      {/* Education */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-[11px] font-600 tracking-wider text-accent/80">Education</h2>
        {education.map((edu) => (
          <div key={edu.school} className="mb-2">
            <div className="flex justify-between">
              <span className="font-500 text-primary">{edu.degree}</span>
              <span className="text-tertiary">{edu.date}</span>
            </div>
            <p className="text-secondary">{edu.school}</p>
            <p className="mt-0.5 text-[11px] text-tertiary">{edu.details}</p>
          </div>
        ))}
      </motion.div>

      {/* Experience */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-[11px] font-600 tracking-wider text-accent/80">Experience</h2>
        {experiences.map((exp) => (
          <div key={exp.company} className="mb-3">
            <div className="flex justify-between">
              <span className="font-500 text-primary">{exp.role}</span>
              <span className="text-tertiary">{exp.date}</span>
            </div>
            <p className="text-accent">
              {exp.company}
              {exp.location && <span className="text-tertiary"> — {exp.location}</span>}
            </p>
            <p className="mt-1 leading-relaxed text-secondary">{exp.summary}</p>
            <ul className="mt-1 space-y-0.5">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-1.5 text-secondary">
                  <span className="shrink-0 text-accent/40">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      {/* Projects */}
      <motion.div variants={item} className="mb-4">
        <h2 className="mb-2 font-display text-[11px] font-600 tracking-wider text-accent/80">Projects</h2>
        {projects.slice(0, 3).map((proj) => (
          <div key={proj.name} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="font-500 text-primary">{proj.name}</span>
              <span className="rounded border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 text-[10px] text-tertiary">{proj.tag}</span>
            </div>
            <p className="text-secondary">{proj.description}</p>
            <p className="mt-0.5 text-[11px] text-accent/70">{proj.tech.join(" · ")}</p>
          </div>
        ))}
      </motion.div>

      {/* Skills */}
      <motion.div variants={item} className="mb-5">
        <h2 className="mb-2 font-display text-[11px] font-600 tracking-wider text-accent/80">Technical Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill.name} className="rounded border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 text-[11px] text-secondary">
              {skill.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Download button */}
      <motion.div variants={item} className="flex justify-center gap-3 border-t border-white/[0.04] pt-4">
        <a
          href="https://drive.google.com/file/d/1Ff9iWJJRu9jcSKh-Zixmy6gNN8GaO5b1/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.06] px-5 py-2.5 text-xs text-accent transition-all hover:bg-accent/[0.12]"
        >
          <ExternalLink size={13} />
          View Full Resume
        </a>
      </motion.div>
    </motion.div>
  );
}
