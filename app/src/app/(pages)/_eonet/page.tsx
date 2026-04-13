"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {  AlertTriangle,  CloudLightning,  Flame,  Globe2,  MapPin,  Mountain,  Snowflake, Filter } from "lucide-react";
import axios from "axios";


// Tipagem da API EONET
type Geometry = {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: string;
  coordinates: number[];
};

type EonetEvent = {
  id: string;
  title: string;
  description: string;
  link: string;
  categories: Array<{ id: string; title: string }>;
  geometry: Geometry[];
};


const fetchEarthEvents = async (days: number): Promise<EonetEvent[]> => {
  const res = await axios.get<EonetEvent[]>(`/api/eonet?days=${days}`);
  return res.data;
};


// Dicionário visual para traduzir e estilizar as categorias da NASA
const categoryConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  wildfires: { icon: Flame, color: "text-red-500", bg: "bg-red-500/10", label: "Incêndios" },
  volcanoes: { icon: Mountain, color: "text-orange-500", bg: "bg-orange-500/10", label: "Vulcões" },
  "severe-storms": { icon: CloudLightning, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "Tempestades" },
  "sea-lake-ice": { icon: Snowflake, color: "text-blue-300", bg: "bg-blue-300/10", label: "Gelo e Icebergs" },
  default: { icon: AlertTriangle, color: "text-primary", bg: "bg-primary/10", label: "Anomalia" },
};


export default function EonetPage() {
  const [days, setDays] = useState(30);
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // null = Todos

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["eonet-events", days],
    queryFn: () => fetchEarthEvents(days),
  });

  // Filtra os eventos baseados na categoria selecionada no menu
  const filteredEvents = events?.filter(event => 
    activeCategory ? event.categories[0]?.id === activeCategory : true
  );

  // Extrai as categorias únicas disponíveis nos dados atuais para gerar os botões de filtro
  const availableCategories = Array.from(
    new Set(events?.map(e => e.categories[0]?.id).filter(Boolean))
  );

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      
      {/* Background Decorativo Terrestre */}
      <div className="fixed top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-cyan-900/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: Título e Controles */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
              <Globe2 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                Monitoramento Planetário
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Earth Observatory Natural Event Tracker (EONET)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-sm w-fit">
            <span className="text-xs text-muted-foreground uppercase tracking-widest pl-2">Período:</span>
            <select 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-transparent text-foreground text-sm font-bold outline-none cursor-pointer border-l border-white/10 pl-3 py-1"
            >
              <option value={7} className="bg-background">Últimos 7 dias</option>
              <option value={15} className="bg-background">Últimos 15 dias</option>
              <option value={30} className="bg-background">Últimos 30 dias</option>
              <option value={90} className="bg-background">Últimos 3 meses</option>
            </select>
          </div>
        </motion.div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-2xl text-destructive text-center mt-10">
            <p>Conexão com os satélites interrompida. Tente novamente mais tarde.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
          
          {/* SIDEBAR: Filtros de Categoria */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-64 shrink-0 space-y-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold uppercase tracking-widest mb-6">
              <Filter className="w-4 h-4" /> Classificação
            </div>

            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                activeCategory === null 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5"
              }`}
            >
              Todas as Anomalias
            </button>

            {availableCategories.map((catId) => {
              const config = categoryConfig[catId] || categoryConfig.default;
              const Icon = config.icon;
              const isActive = activeCategory === catId;

              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(catId)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                    isActive 
                      ? `${config.bg} ${config.color} border-current opacity-100` 
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "" : config.color}`} />
                  {config.label}
                </button>
              );
            })}
          </motion.div>

          {/* ÁREA PRINCIPAL: Feed de Eventos */}
          <div className="grow">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Globe2 className="w-12 h-12 text-cyan-500/50 animate-spin-slow" />
                <p className="text-cyan-500 font-mono text-sm uppercase tracking-widest animate-pulse">
                  Recebendo telemetria da superfície...
                </p>
              </div>
            ) : filteredEvents?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-white/5 bg-white/5 rounded-3xl">
                <p>Nenhuma anomalia geológica ou climática detectada neste filtro.</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredEvents?.map((event) => {
                    const categoryId = event.categories[0]?.id;
                    const config = categoryConfig[categoryId] || categoryConfig.default;
                    const Icon = config.icon;
                    // Pegamos as coordenadas do último registro de geometria do evento
                    const latestGeom = event.geometry[event.geometry.length - 1];
                    const date = new Date(latestGeom?.date).toLocaleDateString("pt-BR");
                    const [lon, lat] = latestGeom?.coordinates || [0, 0];

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={event.id}
                        className="bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 backdrop-blur-sm transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {date}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-4">
                          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                            <span>LAT:</span>
                            <span className="text-white/80">{lat?.toFixed(4)}°</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                            <span>LON:</span>
                            <span className="text-white/80">{lon?.toFixed(4)}°</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
