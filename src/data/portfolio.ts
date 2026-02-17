export const personalInfo = {
  name: "Akshaj",
  initials: "A",
  title: "CS Graduate Student · Full-Stack & AI/ML Engineer",
  location: "Chicago, IL · University of Illinois Chicago",
  bio: [
    "I'm a Master's student in Computer Science at UIC, passionate about building scalable distributed systems and intelligent applications. My experience spans AI/ML engineering, full-stack development, cybersecurity, and cloud architecture.",
    "Previously, I co-founded ESWAF Building Solutions, a construction technology startup in Chennai, India, where I built distributed systems handling high-volume transactions. I believe technology should be accessible to everyone—which led me to develop an SMS-based AI platform for rural communities without smartphones.",
  ],
  stats: [
    { value: "M.S.", label: "CS @ UIC" },
    { value: "5+", label: "Languages" },
    { value: "∞", label: "Curiosity" },
  ],
  links: {
    github: "https://github.com/realAkshaj",
    linkedin: "https://www.linkedin.com/in/akshajks/",
    email: "akshaj32@gmail.com",
    emailAlt: "akurr@uic.edu",
    website: "https://akshajks.com",
  },
};

export interface Project {
  name: string;
  description: string;
  tag: string;
  tagColor: "ai" | "systems" | "web" | "security" | "impact";
  tech: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    name: "AI Content Management System",
    description:
      "A sophisticated, full-stack AI-powered CMS for modern multi-tenant content workflows. Features dark glassmorphism UI, Google Gemini integration for automated article generation, SEO optimization, and quality scoring. Includes JWT auth, role-based access control, a WYSIWYG editor, and a built-in public blog.",
    tag: "Full-Stack",
    tagColor: "web",
    tech: ["Next.js", "Express", "PostgreSQL", "Gemini AI", "JWT"],
    link: "https://ai-cms-platform-web.vercel.app",
  },
  {
    name: "LLM Conversational Agent",
    description:
      "A multi-turn conversational agent combining AWS Bedrock and Ollama in a microservices architecture. Built with Akka HTTP and Scala, it chains AWS Lambda (Titan Text Lite) for initial responses with local Ollama (LLaMA 3.2) for follow-ups, supporting up to 5 autonomous conversation turns with full logging. Containerized with Docker Compose and deployable on AWS EC2 via ECR.",
    tag: "AI/ML",
    tagColor: "ai",
    tech: ["Scala", "AWS Lambda", "Ollama", "Akka HTTP", "Docker"],
    link: "https://github.com/realAkshaj/LLM-Microservice",
  },
  {
    name: "Distributed Telemetry Pipeline",
    description:
      "High-throughput distributed pipeline for real-time telemetry data ingestion, processing, and visualization. Built to handle millions of events per second with fault tolerance and horizontal scaling.",
    tag: "Systems",
    tagColor: "systems",
    tech: ["Go", "Kafka", "Kubernetes", "InfluxDB", "Grafana"],
  },
  {
    name: "ML Training Infrastructure",
    description:
      "Scalable machine learning training infrastructure on AWS enabling efficient model training, hyperparameter tuning, and experiment tracking for research teams.",
    tag: "AI/ML",
    tagColor: "ai",
    tech: ["Python", "PyTorch", "AWS SageMaker", "Docker", "MLflow"],
  },
  {
    name: "Toxicity Detection Research",
    description:
      "Research on AI-driven toxicity detection using RealToxicityPrompts and ToxiGen datasets. Analyzed model behavior and bias patterns in large language models for safer AI deployment.",
    tag: "AI/ML",
    tagColor: "ai",
    tech: ["Python", "Transformers", "NLP", "Jupyter"],
  },
  {
    name: "SMS-Based AI Platform",
    description:
      "AI-powered platform bringing intelligent services to rural communities without smartphones via SMS. Enabling access to information, translation, and assistance through basic mobile phones.",
    tag: "Social Impact",
    tagColor: "impact",
    tech: ["Python", "Twilio", "LLMs", "REST APIs"],
  },
];

export interface Skill {
  name: string;
  level: number;
  color: string;
}

export const skills: Skill[] = [
  { name: "Python", level: 95, color: "#f9e2af" },
  { name: "Java", level: 88, color: "#f38ba8" },
  { name: "JavaScript/TypeScript", level: 90, color: "#a6e3a1" },
  { name: "Go", level: 82, color: "#89b4fa" },
  { name: "React / Next.js", level: 85, color: "#89dceb" },
  { name: "AWS / Cloud", level: 88, color: "#fab387" },
  { name: "Docker / Kubernetes", level: 80, color: "#cba6f7" },
  { name: "PyTorch / ML", level: 85, color: "#f5c2e7" },
  { name: "SQL / NoSQL", level: 87, color: "#94e2d5" },
  { name: "Distributed Systems", level: 86, color: "#89b4fa" },
];

export const expertiseAreas: string[] = [
  "Full-Stack Development",
  "AI/ML Engineering",
  "Distributed Systems",
  "Cloud Architecture (AWS)",
  "Cybersecurity",
  "Data Engineering",
];

export interface Experience {
  role: string;
  company: string;
  location?: string;
  date: string;
  summary: string;
  bullets: string[];
  color: string;
}

export const experiences: Experience[] = [
  
  {
    role: "Co-Founder & Software Developer",
    company: "ESWAF Building Solutions",
    location: "Chennai, India",
    date: "Jun. 2022 — Dec. 2023",
    summary: "Co-founded a construction technology startup and led full-stack development across the entire product lifecycle.",
    bullets: [
      "Built scalable microservices using Python and Java processing 50K+ daily transactions with 99.9% uptime across 15+ enterprise clients, reducing API latency 65% (800ms to 280ms) through distributed architecture and query optimization",
      "Designed and shipped user-facing React frontends with TypeScript alongside RESTful API backends, achieving 95% test coverage through pytest and JUnit frameworks",
      "Implemented Jenkins CI/CD pipelines with Docker containerization, cutting deployment time 60% and enabling rapid iteration across sprint cycles",
      "Collaborated with cross-functional stakeholders through 50+ code reviews and technical design discussions, communicating architecture decisions to non-technical clients",
      "Reduced mean time to resolution from 45min to 8min by building CloudWatch monitoring dashboards and establishing incident response protocols",
    ],
    color: "#cba6f7",
  }
];

export interface Education {
  degree: string;
  school: string;
  date: string;
  details: string;
}

export const education: Education[] = [
  {
    degree: "M.S. Computer Science",
    school: "University of Illinois Chicago (UIC)",
    date: "Aug 2024 — May 2026 (Expected)",
    details:
      "Coursework in Machine Learning on Graphs, Distributed Systems, and AI Safety. Research on toxicity detection, graph neural networks, and computational complexity.",
  },
  {
    degree: "B.E. Computer Science & Engineering",
    school: "S.A. Engineering College, Anna University",
    date: "Aug 2020 — May 2024",
    details:
      "Comprehensive foundation in computer science including algorithms, data structures, software engineering, database systems, and computer networks.",
  },
];

export const desktopIcons = [
  { id: "about" as const, label: "About Me", emoji: "👤", gradient: "from-[#89b4fa] to-[#74c7ec]" },
  { id: "projects" as const, label: "Projects", emoji: "📂", gradient: "from-[#a6e3a1] to-[#94e2d5]" },
  { id: "skills" as const, label: "Skills", emoji: "⚡", gradient: "from-[#cba6f7] to-[#f5c2e7]" },
  { id: "experience" as const, label: "Experience", emoji: "💼", gradient: "from-[#fab387] to-[#f9e2af]" },
  { id: "education" as const, label: "Education", emoji: "🎓", gradient: "from-[#f38ba8] to-[#eb6f92]" },
  { id: "contact" as const, label: "Contact", emoji: "✉️", gradient: "from-[#94e2d5] to-[#89dceb]" },
  { id: "resume" as const, label: "Resume", emoji: "📄", gradient: "from-[#f5c2e7] to-[#cba6f7]" },
  { id: "terminal" as const, label: "Terminal", emoji: "💻", gradient: "from-[#a6adc8] to-[#585b70]" },
];

export const dockItems = desktopIcons.map((icon) => ({ ...icon }));
