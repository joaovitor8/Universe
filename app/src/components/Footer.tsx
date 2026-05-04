"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Orbit, Rocket } from "lucide-react";

import { ENABLED_MODULES, SPACE_MODULES } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// lucide-react v1 removeu ícones de marca; mantemos SVG inline tematizados.
const GithubIcon: IconType = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.36s-1.4-3.4-1.4-3.4a4.4 4.4 0 0 0-.09-3.41S17 2 12 5.5a11 11 0 0 0-4 0C3.5 2 2.5 2 2.5 2a4.4 4.4 0 0 0-.09 3.41S1 7.2 1 12c0 4.83 3 6 6 6.36a4.8 4.8 0 0 0-1 3.24v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: IconType = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const year = new Date().getFullYear();
  const planned = SPACE_MODULES.length - ENABLED_MODULES.length;
  const { t, locale } = useLocale();

  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-background/95 backdrop-blur-md">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.60 0.18 290 / 0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Orbit className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-700" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold tracking-[0.2em]">
                  UNIVERSO
                </span>
                <span className="text-[8px] font-mono tracking-[0.4em] text-muted-foreground/70 mt-0.5">
                  COSMOS · OS
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {t("footer.description")}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <SocialIcon
                href="https://github.com/joaovitor8"
                label="GitHub"
                icon={GithubIcon}
              />
              <SocialIcon
                href="https://linkedin.com/in/joaovitorezequiel"
                label="LinkedIn"
                icon={LinkedinIcon}
              />
            </div>
          </div>

          {/* Módulos ativos */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-1">
              {t("footer.activeModules")}
            </h3>
            <ul className="flex flex-col gap-2">
              {ENABLED_MODULES.slice(0, 6).map((mod) => (
                <li key={mod.id}>
                  <Link
                    href={mod.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: mod.theme.accent,
                        boxShadow: `0 0 8px ${mod.theme.accent}`,
                      }}
                    />
                    {pickLocale(mod.title, mod.titleEn, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status da missão */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-1">
              {t("footer.missionStatus")}
            </h3>
            <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.04]">
              <FooterStat label={t("footer.online")} value={ENABLED_MODULES.length} accent="emerald" />
              <FooterStat label={t("footer.planned")} value={planned} accent="amber" />
              <FooterStat label="APIs" value={6} accent="cyan" subtitle="NASA · JPL · Caltech · CelesTrak · ESA · SpaceX" small />
              <FooterStat label={t("footer.console")} value="v1.2.0" accent="primary" small />
            </div>

            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_oklch(0.78_0.18_145)]" />
              {t("footer.uplink")}
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span>Universo Project</span>
            <span className="opacity-40">·</span>
            <span>© {year}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{t("footer.builtWith")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all hover:scale-110"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

interface FooterStatProps {
  label: string;
  value: string | number;
  accent: "emerald" | "amber" | "cyan" | "primary";
  subtitle?: string;
  small?: boolean;
}

const ACCENT_COLOR: Record<FooterStatProps["accent"], string> = {
  emerald: "oklch(0.78 0.18 145)",
  amber: "oklch(0.78 0.16 80)",
  cyan: "oklch(0.78 0.13 200)",
  primary: "oklch(0.60 0.18 290)",
};

function FooterStat({ label, value, accent, subtitle, small }: FooterStatProps) {
  return (
    <div className="bg-background/60 p-3 flex flex-col gap-0.5">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
        {label}
      </span>
      <span
        className={`font-mono font-bold tabular-nums ${small ? "text-sm" : "text-xl"}`}
        style={{ color: ACCENT_COLOR[accent] }}
      >
        {value}
      </span>
      {subtitle && (
        <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/50 truncate">
          {subtitle}
        </span>
      )}
    </div>
  );
}
