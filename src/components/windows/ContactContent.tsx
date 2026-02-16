"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { Mail, Github, Linkedin, Globe } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const contactCards = [
  { icon: Mail, label: "Email", value: personalInfo.links.email, href: `mailto:${personalInfo.links.email}` },
  { icon: Mail, label: "University Email", value: personalInfo.links.emailAlt, href: `mailto:${personalInfo.links.emailAlt}` },
  { icon: Github, label: "GitHub", value: personalInfo.links.github.replace("https://", ""), href: personalInfo.links.github },
  { icon: Linkedin, label: "LinkedIn", value: personalInfo.links.linkedin.replace("https://www.", ""), href: personalInfo.links.linkedin },
  { icon: Globe, label: "Website", value: personalInfo.links.website.replace("https://", ""), href: personalInfo.links.website },
];

export function ContactContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.p variants={item} className="mb-5 text-sm leading-relaxed text-text">
        Let&apos;s connect! I&apos;m currently looking for new grad software engineering opportunities.
      </motion.p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {contactCards.map((card) => (
          <motion.a key={card.label} variants={item} href={card.href} target="_blank" rel="noopener noreferrer"
            className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent-blue">
            <card.icon className="mx-auto mb-2 h-7 w-7 text-text-dim transition-colors group-hover:text-accent-blue" />
            <p className="mb-1 text-xs text-text-dim">{card.label}</p>
            <p className="break-all text-[13px] text-accent-blue">{card.value}</p>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
