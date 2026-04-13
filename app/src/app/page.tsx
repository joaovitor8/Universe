"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Image as ImageIcon, Telescope, Database, Library, ShieldAlert, Sun, ThermometerSun, Globe2, Layers, Camera, Radio, Terminal, Cpu, Briefcase, Dna, Map as MapIcon } from "lucide-react";
import Link from "next/link";


// Variantes de animação para o Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};


// O Arsenal Completo das 16 APIs da NASA estruturado para um Bento Grid
const apiCards = [
  {
    title: "A Imagem do Dia",
    description: "A galeria diária da NASA (APOD). Cada dia, uma nova janela para a vastidão do espaço.",
    icon: ImageIcon,
    href: "/apod",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Arquivo Central",
    description: "Mecanismo de busca multimídia. Milhares de imagens e vídeos históricos da NASA.",
    icon: Library,
    href: "/library",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Rastreio NEO",
    description: "Monitoramento em tempo real de asteroides e objetos próximos à Terra (NeoWs).",
    icon: Telescope,
    href: "/asteroids",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Defesa Planetária",
    description: "Matriz Sentry de Avaliação de Ameaças e cálculo de risco de impacto (CNEOS).",
    icon: ShieldAlert,
    href: "/cneos",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  // {
  //   title: "Clima Espacial",
  //   description: "Relatório tático de erupções e tempestades solares (DONKI).",
  //   icon: Sun,
  //   href: "/donki",
  //   colSpan: "md:col-span-1 lg:col-span-1",
  // },
  // {
  //   title: "Base InSight",
  //   description: "Arquivo histórico da telemetria e clima na superfície de Marte.",
  //   icon: ThermometerSun,
  //   href: "/mars",
  //   colSpan: "md:col-span-1 lg:col-span-1",
  // },
  // {
  //   title: "Anomalias Terrestres",
  //   description: "Observatório de eventos geológicos e climáticos severos em tempo real (EONET).",
  //   icon: Globe2,
  //   href: "/eonet",
  //   colSpan: "md:col-span-2 lg:col-span-2",
  // },
  // {
  //   title: "Lentes GIBS",
  //   description: "Sobreposição global interativa de dados climáticos e atmosféricos.",
  //   icon: Layers,
  //   href: "/gibs",
  //   colSpan: "md:col-span-1 lg:col-span-1",
  // },
  {
    title: "Satélite DSCOVR",
    description: "Time-lapse da rotação da Terra vista do ponto Lagrange L1 (EPIC).",
    icon: Camera,
    href: "/epic",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Catálogo Exoplanetário",
    description: "Escaneamento profundo de mundos confirmados além do nosso sistema solar.",
    icon: Database,
    href: "/exoplanets",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Tráfego Orbital",
    description: "Radar de cruzamento de frota e rastreio espacial (Situation Center).",
    icon: Radio,
    href: "/ssc",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Terminal TLE",
    description: "Descriptografia de elementos de duas linhas (Two-Line Elements) para cálculo orbital.",
    icon: Terminal,
    href: "/tle",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  // {
  //   title: "Blueprints de P&D",
  //   description: "Esquemas técnicos e níveis de maturidade de novas tecnologias da agência (TechPort).",
  //   icon: Cpu,
  //   href: "/techport",
  //   colSpan: "md:col-span-2 lg:col-span-2",
  // },
  // {
  //   title: "Licenciamento",
  //   description: "Portal B2B de patentes, códigos-fonte abertos e spinoffs (TechTransfer).",
  //   icon: Briefcase,
  //   href: "/techtransfer",
  //   colSpan: "md:col-span-1 lg:col-span-1",
  // },
  // {
  //   title: "Lab. Orbital (OSDR)",
  //   description: "Dossiês confidenciais de bioinformática e vida submetida à microgravidade.",
  //   icon: Dna,
  //   href: "/osdr",
  //   colSpan: "md:col-span-1 lg:col-span-1",
  // },
  // {
  //   title: "Cartografia Planetária (WMTS)",
  //   description: "Motor Slippy Map para explorar livremente os vales e crateras da Lua, Marte e do asteroide Vesta em altíssima resolução.",
  //   icon: MapIcon,
  //   href: "/trek",
  //   colSpan: "md:col-span-4 lg:col-span-4", // Ocupa a linha inteira no final
  // },
];


export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center pb-20 text-foreground">
      
      {/* Elemento decorativo de fundo (Nebulosa suave) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[150px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-24 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Sistemas Operacionais Conectados</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 drop-shadow-sm leading-tight"
        >
          Uma Jornada pelos <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">
            Arquivos do Cosmos
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Navegue pelas APIs abertas da NASA. Da poeira ancestral de Marte à luz de galáxias distantes, a história da exploração universal está codificada e ao seu alcance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#explorar" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-bold tracking-wide transition-all hover:scale-105 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            INICIAR EXPLORAÇÃO
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>

      {/* Bento Grid Section (Portal das APIs) */}
      <section id="explorar" className="container mx-auto px-4 w-full max-w-350 relative z-10">
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">Módulos de Pesquisa</h2>
            <p className="text-sm text-muted-foreground">Selecione uma interface para calibrar a telemetria.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md">
            <span className="text-sm text-primary font-mono font-bold tracking-widest uppercase">8 / 16 Ativos</span>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr"
        >
          {apiCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants} className={card.colSpan}>
              <Link href={card.href} className="block h-full outline-none focus:ring-2 focus:ring-primary rounded-3xl">
                <div className="h-full p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col min-h-55">
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                      <card.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors font-serif">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground/50 group-hover:text-primary transition-colors">
                    ACESSAR <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
