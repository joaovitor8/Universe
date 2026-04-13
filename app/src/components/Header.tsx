"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Orbit, Menu, X,Camera,Database,Globe2,Telescope } from "lucide-react";


// Categorizamos as APIs para o Mega Menu ficar organizado
const apiCategories = [
  {
    title: "Mídia & Arquivos",
    icon: Camera,
    links: [
      { name: "A Imagem do Dia (APOD)", href: "/apod" },
      { name: "Biblioteca Central da NASA", href: "/library" },
      // { name: "Câmeras de Marte", href: "/mars" },
      { name: "Time-lapse Terrestre (EPIC)", href: "/epic" },
    ]
  },
  {
    title: "Monitoramento & Clima",
    icon: Globe2,
    links: [
      { name: "Defesa Planetária (CNEOS)", href: "/cneos" },
      { name: "Rastreio NEO (Asteroides)", href: "/asteroids" },
      // { name: "Clima Solar (DONKI)", href: "/donki" },
      // { name: "Anomalias Terrestres (EONET)", href: "/eonet" },
    ]
  },
  {
    title: "Sondas & Cartografia",
    icon: Telescope,
    links: [
      { name: "Tráfego Orbital (SSC)", href: "/ssc" },
      // { name: "Lentes GIBS", href: "/gibs" },
      // { name: "Cartografia (WMTS Trek)", href: "/trek" },
      { name: "Cálculo Orbital (TLE)", href: "/tle" },
    ]
  },
  {
    title: "Ciência & Engenharia",
    icon: Database,
    links: [
      { name: "Arquivo Exoplanetário", href: "/exoplanets" },
      // { name: "Laboratório Orbital (OSDR)", href: "/osdr" },
      // { name: "Blueprints P&D (TechPort)", href: "/techport" },
      // { name: "Licenciamento (TechTransfer)", href: "/techtransfer" },
    ]
  }
];


export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Pegamos a rota atual para deixar o link no Header "ativo" (brilhante)
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
            <Orbit className="w-6 h-6 text-primary group-hover:animate-spin-slow" />
            <span className="font-serif text-xl font-bold tracking-wider text-foreground">
              UNIVERSO
            </span>
          </Link>

          {/* Navegação Principal (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors ${pathname === "/" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Início
            </Link>

            {/* O Mega Menu Toggle */}
            <div 
              className="relative py-5" // Area de hover
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 transition-colors ${pathname !== "/" && pathname !== "/sobre" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Módulos Estelares <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* O Painel do Mega Menu */}
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 w-200 bg-[#05050a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6"
                  >
                    <div className="grid grid-cols-4 gap-6">
                      {apiCategories.map((category) => (
                        <div key={category.title} className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2 mb-2">
                            <category.icon className="w-4 h-4" /> {category.title}
                          </div>
                          {category.links.map((link) => (
                            <Link 
                              key={link.href} 
                              href={link.href}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className={`text-sm transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-bold" : "text-muted-foreground"}`}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/sobre" 
              className={`transition-colors ${pathname === "/sobre" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sobre o Projeto
            </Link>
          </nav>

          {/* Missão Control / Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all hover:scale-105">
              Mission Control
            </button>
            
            {/* Botão Hambúrguer Mobile */}
            <button 
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Menu Mobile (Tela Cheia) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-3xl lg:hidden overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 flex flex-col gap-8 pb-32">
              {apiCategories.map((category) => (
                <div key={category.title} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest border-b border-white/10 pb-2">
                    <category.icon className="w-5 h-5" /> {category.title}
                  </div>
                  <div className="flex flex-col gap-3 pl-2">
                    {category.links.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base transition-colors ${pathname === link.href ? "text-primary font-bold" : "text-muted-foreground"}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
