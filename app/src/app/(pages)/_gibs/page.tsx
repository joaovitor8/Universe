"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Globe, Layers, Loader2, Map, Search, ThermometerSun, Wind } from "lucide-react";
import axios from "axios";


// Definição das Camadas (Lentes do Satélite)
const GIB_LAYERS = [
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    name: "Cor Real (True Color)",
    desc: "A Terra vista a olho nu pelas lentes do satélite Terra.",
    icon: Globe,
    color: "text-blue-400",
  },
  {
    id: "MODIS_Terra_Land_Surface_Temp_Day",
    name: "Temperatura da Superfície",
    desc: "Emissão térmica da superfície terrestre durante o dia.",
    icon: ThermometerSun,
    color: "text-orange-500",
  },
  {
    id: "MODIS_Terra_Aerosol",
    name: "Aerossóis (Poeira/Fumaça)",
    desc: "Concentração de partículas em suspensão na atmosfera.",
    icon: Wind,
    color: "text-amber-300",
  },
  {
    id: "MODIS_Terra_Cloud_Water_Path",
    name: "Densidade de Nuvens",
    desc: "Quantidade de água líquida presente nas formações de nuvens.",
    icon: Cloud,
    color: "text-cyan-300",
  }
];


type GibsResponse = {
  imageUrl: string;
  date: string;
  layer: string;
};


const fetchGibsSnapshot = async (date: string, layer: string): Promise<GibsResponse> => {
  const res = await axios.get<GibsResponse>(`/api/gibs?date=${date}&layer=${layer}`);
  return res.data;
};


// Ontem é a data mais segura para garantir que o mapa global foi montado pela NASA
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const defaultDate = yesterday.toISOString().split("T")[0];


export default function GibsPage() {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [activeLayer, setActiveLayer] = useState(GIB_LAYERS[0].id);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["gibs", selectedDate, activeLayer],
    queryFn: () => fetchGibsSnapshot(selectedDate, activeLayer),
    // Aumentamos o tempo de staleTime pois imagens não mudam para dias passados
    staleTime: 1000 * 60 * 60, 
  });

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full overflow-hidden flex flex-col md:flex-row">
      
      {/* MESA DE OPERAÇÃO: O Mapa (Fica no fundo da tela) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 to-black">
        
        {/* Grade de coordenadas simulada no fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[100px_100px] pointer-events-none" />

        {(isLoading || isFetching) && (
          <div className="absolute z-20 bg-black/60 backdrop-blur-sm inset-0 flex flex-col items-center justify-center gap-4 transition-opacity">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-blue-400 font-mono text-sm uppercase tracking-widest animate-pulse">
              Calibrando espectrômetro...
            </p>
          </div>
        )}

        {error && (
          <div className="absolute z-20 text-destructive font-mono text-center bg-black/80 p-8 rounded-2xl border border-destructive/30">
            <p>Anomalia na recepção de dados. Camada não disponível para esta data.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {data?.imageUrl && !error && (
            <motion.img 
              key={data.imageUrl}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: isLoading || isFetching ? 0.3 : 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={data.imageUrl} 
              alt="NASA GIBS Map"
              className="w-full h-full object-contain md:object-cover mix-blend-screen opacity-90"
            />
          )}
        </AnimatePresence>
      </div>

      {/* PAINEL DE CONTROLE FLUTUANTE (HUD) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 md:p-6 pointer-events-none">
        
        {/* Topo: Título e Data */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-1">
              <Layers className="w-6 h-6 text-blue-500" />
              <h1 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide">GIBS Viewport</h1>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Global Imagery Browse Services</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl pointer-events-auto flex items-center gap-2"
          >
            <input 
              type="date" 
              max={defaultDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer px-4 py-2"
            />
            <div className="p-2 bg-white/10 rounded-xl">
              <Search className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Base/Lateral: Seletor de Camadas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:w-80 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-3xl pointer-events-auto mt-auto"
        >
          <div className="px-4 pt-3 pb-2 text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2 border-b border-white/5 mb-2">
            <Map className="w-4 h-4" /> Espectro de Análise
          </div>
          
          <div className="flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
            {GIB_LAYERS.map((layer) => {
              const isActive = activeLayer === layer.id;
              const Icon = layer.icon;

              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all text-left ${
                    isActive 
                      ? "bg-white/10 border border-white/20 shadow-inner" 
                      : "bg-transparent border border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${isActive ? 'bg-black/50' : 'bg-white/5'}`}>
                    <Icon className={`w-5 h-5 ${layer.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {layer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {layer.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
