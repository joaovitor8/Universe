"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Orbit, Menu, X, Radar } from "lucide-react";

import {
  CATEGORY_META,
  getModulesByCategory,
  type ModuleCategory,
} from "@/src/lib/modules";

const CATEGORY_ORDER: ModuleCategory[] = [
  "media",
  "defense",
  "cartography",
  "science",
];

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const inModule = pathname !== "/" && pathname !== "/sobre";

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-50 h-16 border-b border-white/[0.06] bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group relative"
          >
            <div className="relative">
              <Orbit className="w-6 h-6 text-primary transition-transform duration-700 group-hover:rotate-180" />
              <span className="absolute inset-0 blur-md bg-primary/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.2em]">
                UNIVERSO
              </span>
              <span className="text-[8px] font-mono tracking-[0.4em] text-muted-foreground/70 mt-0.5 hidden sm:block">
                COSMOS · OS
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm">
            <NavLink href="/" active={pathname === "/"}>
              Início
            </NavLink>

            <div
              className="relative py-5"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 transition-colors font-medium ${
                  inModule
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Módulos Estelares
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 w-[58rem] rounded-2xl shadow-2xl overflow-hidden p-7 border border-white/[0.08] bg-[#06060c]/95 backdrop-blur-2xl"
                  >
                    {/* Brackets */}
                    <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary/60" />
                    <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary/60" />
                    <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary/60" />
                    <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary/60" />

                    <div className="grid grid-cols-4 gap-6">
                      {CATEGORY_ORDER.map((catId) => {
                        const meta = CATEGORY_META[catId];
                        const modules = getModulesByCategory(catId);
                        const Icon = meta.icon;

                        return (
                          <div key={catId} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-primary text-[10px] font-mono uppercase tracking-[0.25em] border-b border-white/[0.08] pb-2 mb-1">
                              <Icon className="w-3.5 h-3.5" /> {meta.title}
                            </div>
                            {modules.map((mod) => {
                              const isActive = mod.status === "active";
                              const isCurrent = pathname === mod.href;
                              return (
                                <Link
                                  key={mod.id}
                                  href={isActive ? mod.href : "#"}
                                  onClick={(e) => {
                                    if (!isActive) e.preventDefault();
                                    setMegaOpen(false);
                                  }}
                                  className={`group flex items-center justify-between gap-2 text-sm transition-colors ${
                                    isCurrent
                                      ? "text-primary font-bold"
                                      : isActive
                                      ? "text-muted-foreground hover:text-foreground"
                                      : "text-muted-foreground/30 cursor-not-allowed"
                                  }`}
                                  aria-disabled={!isActive}
                                >
                                  <span className="flex items-center gap-2">
                                    {isActive && (
                                      <span
                                        className="w-1 h-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_6px_oklch(0.78_0.18_145)]"
                                      />
                                    )}
                                    {mod.title}
                                  </span>
                                  {!isActive ? (
                                    <span className="text-[8px] font-mono tracking-widest uppercase border border-muted-foreground/15 rounded px-1 py-0.5">
                                      Soon
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono opacity-40 group-hover:opacity-80 transition-opacity">
                                      {mod.codename}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/sobre" active={pathname === "/sobre"}>
              Sobre o Projeto
            </NavLink>
          </nav>

          {/* Mission Control + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] px-4 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all hover:scale-[1.03] active:scale-95"
              style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.15)" }}
            >
              <Radar className="w-3.5 h-3.5" />
              Mission Control
            </button>

            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Alternar menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-22 z-40 bg-background/95 backdrop-blur-3xl lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-8 pb-32">
              {CATEGORY_ORDER.map((catId) => {
                const meta = CATEGORY_META[catId];
                const modules = getModulesByCategory(catId);
                const Icon = meta.icon;

                return (
                  <div key={catId} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em] border-b border-white/10 pb-2">
                      <Icon className="w-4 h-4" /> {meta.title}
                    </div>
                    <div className="flex flex-col gap-3 pl-2">
                      {modules.map((mod) => {
                        const isActive = mod.status === "active";
                        const isCurrent = pathname === mod.href;
                        return (
                          <Link
                            key={mod.id}
                            href={isActive ? mod.href : "#"}
                            onClick={(e) => {
                              if (!isActive) e.preventDefault();
                              setMobileOpen(false);
                            }}
                            className={`flex items-center justify-between text-base transition-colors ${
                              isCurrent
                                ? "text-primary font-bold"
                                : isActive
                                ? "text-muted-foreground"
                                : "text-muted-foreground/30"
                            }`}
                          >
                            <span>{mod.title}</span>
                            {!isActive && (
                              <span className="text-[9px] font-mono tracking-widest uppercase border border-muted-foreground/20 rounded px-1.5 py-0.5">
                                Soon
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative py-1 transition-colors font-medium ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute -bottom-1 inset-x-0 h-px bg-primary"
          style={{ boxShadow: "0 0 8px oklch(0.60 0.18 290 / 0.6)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
