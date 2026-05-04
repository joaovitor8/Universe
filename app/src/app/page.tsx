"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import {
  ENABLED_MODULES,
  SPACE_MODULES,
  sizeToColSpan,
} from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function Home() {
  const { t, locale } = useLocale();

  const STATS = [
    { label: t("home.stats.modules"), value: ENABLED_MODULES.length, suffix: `/ ${SPACE_MODULES.length}` },
    { label: t("home.stats.apis"), value: 6, suffix: t("home.stats.channels") },
    { label: t("home.stats.coverage"), value: "16h", suffix: t("home.stats.uptime") },
    { label: t("home.stats.status"), value: t("home.stats.nominal"), mono: true },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center pb-24 text-foreground">
      {/* Nebulosas decorativas */}
      <div className="absolute top-[-12%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-primary/[0.08] blur-[180px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-500/[0.07] blur-[160px] -z-10 pointer-events-none" />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-28 pb-16 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.3em] uppercase mb-8 backdrop-blur-sm"
          style={{ boxShadow: "0 0 24px oklch(0.60 0.18 290 / 0.15)" }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("home.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 leading-[1.05]"
        >
          {t("home.title.l1")} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-400 to-primary inline-block">
            {t("home.title.l2")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t("home.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#explorar"
            className="group flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-bold tracking-[0.2em] text-xs uppercase font-mono transition-all hover:scale-105"
            style={{ boxShadow: "0 0 30px oklch(0.60 0.18 290 / 0.45)" }}
          >
            {t("home.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* ─── Barra de métricas tática ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="container mx-auto px-4 max-w-5xl relative z-10 mb-20"
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06] relative">
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-primary/60" />
          {STATS.map((s, i) => (
            <div key={s.label} className="px-6 py-5 flex flex-col gap-1 relative">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
                {s.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-mono font-bold tabular-nums ${s.mono ? "text-base text-emerald-400" : "text-2xl text-foreground"}`}
                >
                  {s.value}
                  {s.mono && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse align-middle" />}
                </span>
                {s.suffix && (
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                    {s.suffix}
                  </span>
                )}
              </div>
              {!s.mono && (
                <div className="flex gap-0.5 mt-2 opacity-50">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <span
                      key={j}
                      className={`w-1 h-2 rounded-sm ${j < (i === 0 ? 8 : i === 1 ? 6 : 9) ? "bg-primary/60" : "bg-white/10"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Bento Grid de Módulos ────────────────────────── */}
      <section
        id="explorar"
        className="container mx-auto px-4 w-full max-w-[88rem] relative z-10"
      >
        <div className="flex items-end justify-between mb-10 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-2 block">
              {t("home.catalog.label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-1">
              {t("home.catalog.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("home.catalog.subtitle")}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div
              className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md"
              style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.2)" }}
            >
              <span className="text-sm text-primary font-mono font-bold tracking-widest uppercase tabular-nums">
                {String(ENABLED_MODULES.length).padStart(2, "0")} / {SPACE_MODULES.length} {t("home.catalog.active")}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
              {t("home.catalog.refresh")}
            </span>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr"
        >
          {ENABLED_MODULES.map((mod) => {
            const title = pickLocale(mod.title, mod.titleEn, locale);
            const description = pickLocale(mod.description, mod.descriptionEn, locale);
            return (
              <motion.div
                key={mod.id}
                variants={itemVariants}
                className={sizeToColSpan(mod.size)}
                style={
                  {
                    "--module-accent": mod.theme.accent,
                    "--module-accent-soft": mod.theme.accentSoft,
                  } as React.CSSProperties
                }
              >
                <Link
                  href={mod.href}
                  className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--module-accent)] rounded-3xl"
                >
                  <div className="h-full p-6 md:p-7 rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group flex flex-col min-h-[15rem] relative overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: "var(--module-accent-soft)" }}
                    />

                    <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--module-accent)" }} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--module-accent)" }} />
                    <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--module-accent)" }} />
                    <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--module-accent)" }} />

                    <div className="flex items-center justify-between mb-5 relative">
                      <div
                        className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[var(--module-accent-soft)]"
                        style={{
                          borderColor: "color-mix(in oklch, var(--module-accent) 25%, transparent)",
                        }}
                      >
                        <mod.icon
                          className="w-6 h-6 transition-colors"
                          style={{ color: "var(--module-accent)" }}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] text-muted-foreground/60 uppercase">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: "var(--module-accent)",
                            boxShadow: "0 0 6px var(--module-accent)",
                            animation: "hud-pulse 2.4s ease-in-out infinite",
                          }}
                        />
                        {t("home.card.live")}
                      </div>
                    </div>

                    <div className="grow relative">
                      <h3
                        className="text-xl font-bold mb-2 transition-colors font-serif group-hover:text-[var(--module-accent)] leading-tight"
                      >
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono tracking-[0.25em] uppercase relative">
                      <span className="text-muted-foreground/50 group-hover:text-[var(--module-accent)] transition-colors">
                        {mod.codename}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground/50 group-hover:text-[var(--module-accent)] transition-all">
                        {t("home.card.access")}
                        <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
