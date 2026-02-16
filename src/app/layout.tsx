import type { Metadata } from "next";
import { Share_Tech_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Akshaj — Software Engineer",
  description:
    "Portfolio of Akshaj — CS Graduate Student at UIC, Full-Stack & AI/ML Engineer. Interactive OS-style interface.",
  keywords: ["Akshaj", "software engineer", "portfolio", "full-stack", "AI", "ML", "UIC"],
  authors: [{ name: "Akshaj" }],
  openGraph: {
    title: "Akshaj — Software Engineer",
    description: "Interactive OS-style portfolio showcasing projects, skills, and experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshaj — Software Engineer",
    description: "Interactive OS-style portfolio",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${shareTech.variable} ${orbitron.variable}`}>
      <body className="font-body bg-crust text-text antialiased">
        {children}
      </body>
    </html>
  );
}
