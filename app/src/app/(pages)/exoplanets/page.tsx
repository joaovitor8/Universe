"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Globe2, Loader2, Orbit, Ruler, Scale, Search, Telescope,Wifi } from "lucide-react";
import axios from "axios";


// Tipagem baseada na nossa Query SQL
type Exoplanet = {
  pl_name: string;          // Nome do Planeta
  hostname: string;         // Estrela Hospedeira
  discoverymethod: string;  // Método de Descoberta
  disc_year: number;        // Ano
  pl_rade: number | null;   // Raio (Em raios terrestres)
  pl_bmasse: number | null; // Massa (Em massas terrestres)
  pl_orbper: number | null; // Período Orbital (Dias)
  sy_dist: number | null;   // Distância (Parsecs)
};


const fetchExoplanets = async (): Promise<Exoplanet[]> => {
  const res = await axios.get<Exoplanet[]>("/api/exoplanets");
  return res.data;
};


export default function ExoplanetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);

  const { data: exoplanets, isLoading, error } = useQuery({
    queryKey: ["exoplanets"],
    queryFn: fetchExoplanets,
  });

  // Filtro de busca local
  const filteredPlanets = exoplanets?.filter(planet => 
    planet.pl_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.hostname.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Se não houver planeta selecionado, seleciona o primeiro por padrão
  if (filteredPlanets.length > 0 && !selectedPlanet) {
    setSelectedPlanet(filteredPlanets[0]);
  }


  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 flex flex-col">
      
      {/* Background Decorativo Nebulosa */}
      <div className="fixed top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-400 w-full mx-auto grow flex flex-col">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
                Catálogo Exoplanetário
              </h1>
              <p className="text-sm text-emerald-500/70 flex items-center gap-2 font-mono uppercase tracking-widest">
                <Wifi className="w-4 h-4" /> NASA Exoplanet Archive
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Buscar planeta ou estrela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 bg-black/40 text-foreground text-sm border border-white/10 rounded-full pl-11 pr-4 py-2.5 outline-none focus:border-emerald-500/50 transition-all backdrop-blur-sm"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </motion.div>

        {error ? (
          <div className="p-8 border border-destructive/30 bg-destructive/10 rounded-3xl text-destructive text-center">
            Sinal perdido. Não foi possível conectar ao banco de dados estelar.
          </div>
        ) : isLoading ? (
          <div className="grow flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="font-mono text-sm uppercase tracking-widest text-emerald-500 animate-pulse">
              Baixando registros estelares...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 grow h-full lg:h-[120vh]">
            
            {/* SIDEBAR: Lista de Planetas (Master) */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-white/10 bg-white/5 text-xs font-mono text-muted-foreground uppercase tracking-widest flex justify-between">
                <span>Registro</span>
                <span>{filteredPlanets.length} Encontrados</span>
              </div>
              
              <div className="grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredPlanets.map((planet) => {
                  const isSelected = selectedPlanet?.pl_name === planet.pl_name;
                  return (
                    <button
                      key={planet.pl_name}
                      onClick={() => setSelectedPlanet(planet)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex justify-between items-center group ${
                        isSelected 
                          ? "bg-emerald-500/10 border border-emerald-500/30" 
                          : "border border-transparent hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold font-serif text-lg ${isSelected ? "text-emerald-400" : "text-white group-hover:text-emerald-300"}`}>
                          {planet.pl_name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          Estrela: {planet.hostname}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-white/30">{planet.disc_year}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PAINEL PRINCIPAL: Escaneamento Detalhado (Detail) */}
            <div className="w-full lg:w-2/3 xl:w-3/4 bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md flex flex-col relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {selectedPlanet ? (
                  <motion.div
                    key={selectedPlanet.pl_name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    
                    {/* Header do Planeta */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-10 relative z-10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                          <Globe2 className="w-3.5 h-3.5" />
                          Planeta Confirmado
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 drop-shadow-md">
                          {selectedPlanet.pl_name}
                        </h2>
                        <p className="text-muted-foreground text-lg flex items-center gap-2">
                          <Orbit className="w-5 h-5" /> Orbitando: <span className="text-white font-medium">{selectedPlanet.hostname}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">Descoberto em</span>
                        <span className="text-3xl font-mono text-white">{selectedPlanet.disc_year}</span>
                        <span className="block text-xs text-muted-foreground mt-2 border-t border-white/10 pt-2">
                          Método: {selectedPlanet.discoverymethod}
                        </span>
                      </div>
                    </div>

                    {/* Gráfico Visual / "Holograma" (Falso, mas esteticamente incrível) */}
                    <div className="grow flex items-center justify-center relative my-8 min-h-50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border border-emerald-500/20 rounded-full animate-spin-slow" />
                        <div className="w-48 h-48 border border-white/5 rounded-full absolute animate-reverse-spin" />
                        <div className="w-32 h-32 bg-linear-to-tr from-emerald-900 to-black rounded-full absolute shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
                      </div>
                    </div>

                    {/* Ficha Técnica (Telemetria) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto relative z-10">
                      
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Scale className="w-4 h-4" /> Massa
                        </span>
                        <p className="text-2xl font-light text-white">
                          {selectedPlanet.pl_bmasse ? selectedPlanet.pl_bmasse.toFixed(2) : "Desconhecida"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">x Massa da Terra</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Ruler className="w-4 h-4" /> Raio
                        </span>
                        <p className="text-2xl font-light text-white">
                          {selectedPlanet.pl_rade ? selectedPlanet.pl_rade.toFixed(2) : "Desconhecido"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">x Raio da Terra</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Orbit className="w-4 h-4" /> Ano Local
                        </span>
                        <p className="text-2xl font-light text-white">
                          {selectedPlanet.pl_orbper ? selectedPlanet.pl_orbper.toFixed(1) : "?"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Dias Terrestres</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Telescope className="w-4 h-4" /> Distância
                        </span>
                        <p className="text-2xl font-light text-white">
                          {selectedPlanet.sy_dist ? selectedPlanet.sy_dist.toFixed(0) : "?"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Parsecs da Terra</p>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Selecione um planeta no terminal para iniciar o escaneamento.
                  </div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
