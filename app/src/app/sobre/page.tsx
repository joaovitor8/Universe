"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Heart,
  Library,
  Newspaper,
  Orbit,
  Radar,
  Rocket,
  Satellite,
  Sparkles,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useT } from "@/src/lib/i18n";
import { ENABLED_MODULES, SPACE_MODULES } from "@/src/lib/modules";
import { HudPanel } from "@/src/components/hud";

interface DataSource {
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

const DATA_SOURCES: DataSource[] = [
  { name: "NASA APOD", description: "Astronomy Picture of the Day", url: "https://apod.nasa.gov", icon: Sparkles },
  { name: "NeoWs", description: "Near Earth Object Web Service", url: "https://api.nasa.gov", icon: Radar },
  { name: "CNEOS Sentry", description: "JPL impact-risk monitoring", url: "https://cneos.jpl.nasa.gov/sentry", icon: Atom },
  { name: "EPIC", description: "DSCOVR L1 imager", url: "https://epic.gsfc.nasa.gov", icon: Satellite },
  { name: "Exoplanet Archive", description: "Caltech TAP service", url: "https://exoplanetarchive.ipac.caltech.edu", icon: Database },
  { name: "NASA Library", description: "Image & Video Library", url: "https://images.nasa.gov", icon: Library },
  { name: "SSC", description: "Space Situation Center", url: "https://sscweb.gsfc.nasa.gov", icon: Orbit },
  { name: "CelesTrak TLE", description: "Two-Line Elements", url: "https://celestrak.org", icon: Code2 },
  { name: "SpaceX API", description: "Falcon/Starship fleet", url: "https://github.com/r-spacex/SpaceX-API", icon: Rocket },
  { name: "Spaceflight News", description: "Aggregated press feed", url: "https://spaceflightnewsapi.net", icon: Newspaper },
  { name: "TechPort", description: "NASA R&D portfolio", url: "https://techport.nasa.gov", icon: Cpu },
  { name: "DONKI", description: "Space Weather Database", url: "https://ccmc.gsfc.nasa.gov/tools/DONKI", icon: Sun },
];

const STACK_GROUPS = [
  { label: "Frontend", items: ["Next.js 16 · App Router", "React 19", "TypeScript 5 (strict)", "Tailwind CSS v4"] },
  { label: "Render & UI", items: ["Framer Motion", "shadcn primitives", "Lucide icons", "tw-animate-css"] },
  { label: "3D & Shaders", items: ["React Three Fiber", "drei", "GLSL inline (Schwarzschild aprox.)", "three.js 0.184"] },
  { label: "Data layer", items: ["TanStack Query v5", "Axios", "Next.js Route Handlers (BFF)", "ISR via revalidate"] },
];

export default function SobrePage() {
  const t = useT();
  const planned = SPACE_MODULES.length - ENABLED_MODULES.length;

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-8">
      {/* Glow ambiente */}
      <div
        aria-hidden
        className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/[0.07] blur-[180px] -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-blue-500/[0.06] blur-[160px] -z-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 relative">
              <BookOpen className="w-7 h-7 text-primary" />
              <div className="absolute inset-0 rounded-xl blur-md bg-primary/15" style={{ animation: "hud-pulse 3s ease-in-out infinite" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {t("about.codename")}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
                {t("about.title")}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mt-1">
                {t("about.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md">
              <span className="text-sm text-primary font-mono font-bold tracking-widest tabular-nums">
                {String(ENABLED_MODULES.length).padStart(2, "0")} / {SPACE_MODULES.length}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
              {planned} planned
            </span>
          </div>
        </motion.div>

        {/* Manifesto */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <HudPanel
            label={t("about.manifesto.title")}
            badge={<Heart className="w-4 h-4 text-primary" />}
            className="md:p-12"
          >
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-3xl">
              {t("about.manifesto.body")}
            </p>
          </HudPanel>
        </motion.section>

        {/* Stack */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5" /> {t("about.stack.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {STACK_GROUPS.map((g) => (
              <HudPanel key={g.label} label={g.label} className="p-5 md:p-5">
                <ul className="space-y-1.5 text-xs font-mono">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </HudPanel>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" /> {t("about.timeline.title")}
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50">
              {t("about.timeline.subtitle")}
            </span>
          </div>

          <div className="relative pl-6 border-l border-white/10 space-y-5">
            {([
              { title: t("about.timeline.w1.title"), body: t("about.timeline.w1.body") },
              { title: t("about.timeline.w2.title"), body: t("about.timeline.w2.body") },
              { title: t("about.timeline.w3.title"), body: t("about.timeline.w3.body") },
              { title: t("about.timeline.w4.title"), body: t("about.timeline.w4.body") },
              { title: t("about.timeline.w5.title"), body: t("about.timeline.w5.body") },
            ]).map((w, i) => (
              <div key={i} className="relative">
                <span
                  className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full border-2 border-primary/60 bg-background"
                  style={{ boxShadow: "0 0 8px oklch(0.60 0.18 290 / 0.5)" }}
                />
                <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-primary">
                  {w.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{w.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Fontes de dados */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 flex items-center gap-2">
            <Database className="w-3.5 h-3.5" /> {t("about.apis.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DATA_SOURCES.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="grow min-w-0">
                    <div className="font-mono font-bold text-sm truncate">{s.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground/70 truncate uppercase tracking-wider">
                      {s.description}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </motion.section>

        {/* Autor */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 block">
              {t("about.author")}
            </span>
            <p className="font-serif text-2xl font-bold mt-1">João Vitor</p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-primary hover:underline"
          >
            <Orbit className="w-4 h-4" />
            Universe.OS · v1.2.0
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
