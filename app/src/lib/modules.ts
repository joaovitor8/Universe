import {
  Briefcase,
  Camera,
  Cpu,
  Database,
  Dna,
  Globe2,
  Image as ImageIcon,
  Layers,
  Library,
  Map as MapIcon,
  Newspaper,
  Radio,
  Rocket,
  ShieldAlert,
  Sun,
  Telescope,
  Terminal,
  ThermometerSun,
  type LucideIcon,
} from "lucide-react";

export type ModuleStatus = "active" | "planned";
export type ModuleSize = "sm" | "lg";
export type ModuleCategory = "media" | "defense" | "cartography" | "science";

export interface ModuleTheme {
  /** Cor de destaque viva (oklch). Usada em glows, ícones, headlines. */
  accent: string;
  /** Variante translúcida para fundos e estados hover. */
  accentSoft: string;
  /** Box-shadow pronto para aplicar no hover do card. */
  glow: string;
}

export interface SpaceModule {
  id: string;
  /** Codinome táctico curto, exibido em fonte mono nos HUDs. */
  codename: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: ModuleCategory;
  status: ModuleStatus;
  size: ModuleSize;
  theme: ModuleTheme;
}

const theme = (accent: string): ModuleTheme => ({
  accent,
  accentSoft: accent.replace(")", " / 0.15)"),
  glow: `0 0 32px ${accent.replace(")", " / 0.35)")}`,
});

export const SPACE_MODULES: SpaceModule[] = [
  {
    id: "apod",
    codename: "APOD-01",
    title: "A Imagem do Dia",
    description:
      "A galeria diária da NASA. Cada dia, uma nova janela para a vastidão do espaço.",
    href: "/apod",
    icon: ImageIcon,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.16 80)"),
  },
  {
    id: "library",
    codename: "ARCHIVE-CENTRAL",
    title: "Arquivo Central",
    description:
      "Mecanismo de busca multimídia. Milhares de imagens e vídeos históricos da NASA.",
    href: "/library",
    icon: Library,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.74 0.15 60)"),
  },
  {
    id: "asteroids",
    codename: "NEO-RADAR",
    title: "Rastreio NEO",
    description:
      "Monitoramento em tempo real de asteroides e objetos próximos à Terra (NeoWs).",
    href: "/asteroids",
    icon: Telescope,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.72 0.18 35)"),
  },
  {
    id: "cneos",
    codename: "SENTRY-MATRIX",
    title: "Defesa Planetária",
    description:
      "Matriz Sentry de Avaliação de Ameaças e cálculo de risco de impacto (CNEOS).",
    href: "/cneos",
    icon: ShieldAlert,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.65 0.22 25)"),
  },
  {
    id: "epic",
    codename: "DSCOVR-L1",
    title: "Satélite DSCOVR",
    description:
      "Time-lapse da rotação da Terra vista do ponto Lagrange L1 (EPIC).",
    href: "/epic",
    icon: Camera,
    category: "media",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.72 0.14 220)"),
  },
  {
    id: "exoplanets",
    codename: "DEEP-CATALOG",
    title: "Catálogo Exoplanetário",
    description:
      "Escaneamento profundo de mundos confirmados além do nosso sistema solar.",
    href: "/exoplanets",
    icon: Database,
    category: "science",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.68 0.18 290)"),
  },
  {
    id: "ssc",
    codename: "ORBIT-TRAFFIC",
    title: "Tráfego Orbital",
    description:
      "Radar de cruzamento de frota e rastreio espacial (Situation Center).",
    href: "/ssc",
    icon: Radio,
    category: "cartography",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.74 0.15 145)"),
  },
  {
    id: "tle",
    codename: "TLE-TERMINAL",
    title: "Terminal TLE",
    description:
      "Descriptografia de elementos de duas linhas para cálculo orbital.",
    href: "/tle",
    icon: Terminal,
    category: "cartography",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.18 130)"),
  },
  {
    id: "spacex",
    codename: "FALCON-FLEET",
    title: "Frota SpaceX",
    description:
      "Próximos lançamentos, frota Falcon/Starship e missões privadas em órbita.",
    href: "/spacex",
    icon: Rocket,
    category: "cartography",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.12 30)"),
  },
  {
    id: "news",
    codename: "COMMS-INTERCEPT",
    title: "Comms Intercept",
    description:
      "Feed agregado de notícias do setor espacial — NASA, ESA, SpaceX, ISRO e Roscosmos.",
    href: "/news",
    icon: Newspaper,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.76 0.15 100)"),
  },
  {
    id: "techport",
    codename: "TECHPORT",
    title: "Blueprints de P&D",
    description:
      "Esquemas técnicos e níveis de maturidade (TRL) de tecnologias da agência.",
    href: "/techport",
    icon: Cpu,
    category: "science",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.16 195)"),
  },
  {
    id: "donki",
    codename: "DONKI-SOL",
    title: "Clima Espacial",
    description:
      "Relatório táctico de erupções e tempestades solares (DONKI).",
    href: "/donki",
    icon: Sun,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.80 0.16 70)"),
  },
  {
    id: "mars",
    codename: "INSIGHT-BASE",
    title: "Base InSight",
    description:
      "Arquivo histórico da telemetria e clima na superfície de Marte.",
    href: "/mars",
    icon: ThermometerSun,
    category: "media",
    status: "planned",
    size: "sm",
    theme: theme("oklch(0.65 0.18 30)"),
  },
  {
    id: "eonet",
    codename: "EONET-WATCH",
    title: "Anomalias Terrestres",
    description:
      "Observatório de eventos geológicos e climáticos severos em tempo real (EONET).",
    href: "/eonet",
    icon: Globe2,
    category: "defense",
    status: "planned",
    size: "lg",
    theme: theme("oklch(0.72 0.16 165)"),
  },
  {
    id: "gibs",
    codename: "GIBS-LENS",
    title: "Lentes GIBS",
    description:
      "Sobreposição global interativa de dados climáticos e atmosféricos.",
    href: "/gibs",
    icon: Layers,
    category: "cartography",
    status: "planned",
    size: "sm",
    theme: theme("oklch(0.74 0.13 200)"),
  },
  {
    id: "techtransfer",
    codename: "T-TRANSFER",
    title: "Licenciamento",
    description:
      "Portal B2B de patentes, códigos-fonte abertos e spinoffs (TechTransfer).",
    href: "/techtransfer",
    icon: Briefcase,
    category: "science",
    status: "planned",
    size: "sm",
    theme: theme("oklch(0.72 0.14 50)"),
  },
  {
    id: "osdr",
    codename: "OSDR-LAB",
    title: "Lab. Orbital (OSDR)",
    description:
      "Dossiês confidenciais de bioinformática e vida submetida à microgravidade.",
    href: "/osdr",
    icon: Dna,
    category: "science",
    status: "planned",
    size: "sm",
    theme: theme("oklch(0.70 0.17 320)"),
  },
  {
    id: "trek",
    codename: "TREK-WMTS",
    title: "Cartografia Planetária",
    description:
      "Slippy Map para explorar livremente vales e crateras da Lua, Marte e Vesta.",
    href: "/trek",
    icon: MapIcon,
    category: "cartography",
    status: "planned",
    size: "lg",
    theme: theme("oklch(0.70 0.13 45)"),
  },
];

export const ENABLED_MODULES = SPACE_MODULES.filter((m) => m.status === "active");

export const CATEGORY_META: Record<
  ModuleCategory,
  { title: string; icon: LucideIcon }
> = {
  media:       { title: "Mídia & Arquivos",       icon: Camera   },
  defense:     { title: "Defesa & Monitoramento", icon: Globe2   },
  cartography: { title: "Sondas & Cartografia",   icon: Telescope },
  science:     { title: "Ciência & Engenharia",   icon: Database },
};

export const sizeToColSpan = (size: ModuleSize) =>
  size === "lg" ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1";

export const getModule = (id: string): SpaceModule | undefined =>
  SPACE_MODULES.find((m) => m.id === id);

export const getModulesByCategory = (category: ModuleCategory) =>
  SPACE_MODULES.filter((m) => m.category === category);
