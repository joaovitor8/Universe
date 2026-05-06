"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useLocale } from "@/src/lib/i18n";

export default function Home() {
  const { t } = useLocale();

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
      </section>
    </div>
  );
}
