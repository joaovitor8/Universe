"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Calendar, Crosshair, Loader2, LocateFixed, Orbit, Radio, Satellite, Search } from "lucide-react";
import axios from "axios";


// Tipagem da API SSC
type Observatory = {
  Id: string;
  Name: string;
  Resolution: number;
  StartTime: string;
  EndTime: string;
};


const fetchObservatories = async (): Promise<Observatory[]> => {
  const res = await axios.get<Observatory[]>("/api/ssc");
  // A API da NASA tem a peculiaridade de às vezes retornar objetos simples se houver só um, 
  // mas nossa rota já garante que é um array.
  return res.data;
};


// Utilitário para formatar datas espaciais (ISO 8601 da NASA)
const formatOrbitalDate = (dateString: string) => {
  if (!dateString) return "Desconhecido";
  // As datas do SSC vêm no formato: 2022-01-01T00:00:00Z
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();
};


export default function SscPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSat, setSelectedSat] = useState<Observatory | null>(null);

  const { data: observatories, isLoading, error } = useQuery({
    queryKey: ["ssc-observatories"],
    queryFn: fetchObservatories,
    staleTime: Infinity, // A lista de satélites não muda com frequência
  });

  // Filtra os satélites localmente para busca ultra-rápida
  const filteredSats = observatories?.filter(sat => 
    sat.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sat.Id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Auto-seleciona o primeiro satélite para o radar não ficar vazio
  if (filteredSats.length > 0 && !selectedSat) {
    setSelectedSat(filteredSats[0]);
  }

  return (
    <div className="min-h-screen text-violet-50 pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background Eletromagnético */}
      <div className="fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/10 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none -z-10" />

      {/* Grid de Coordenadas Fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-size:50px_50px pointer-events-none -z-10" />

      <div className="max-w-400 mx-auto w-full grow flex flex-col h-[calc(100vh-8rem)]">
        
        {/* HEADER: Controle de Tráfego */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-violet-900/30 pb-6 shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/30 relative">
              <Satellite className="w-8 h-8 text-violet-400 relative z-10" />
              <div className="absolute inset-0 bg-violet-500/20 blur-md rounded-xl animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
                Controle de Tráfego Orbital
              </h1>
              <p className="text-sm text-cyan-400/80 flex items-center gap-2 font-mono uppercase tracking-widest">
                <Radio className="w-4 h-4" /> Satellite Situation Center (SSC)
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-80">
            <input 
              type="text" 
              placeholder="Buscar sonda ou satélite..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0718] text-violet-50 border border-violet-900/50 rounded-lg pl-11 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-violet-900"
            />
            <Search className="w-4 h-4 text-violet-700 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
          </div>
        </motion.div>

        {error ? (
          <div className="p-8 border border-red-900/30 bg-red-950/20 text-red-500 rounded-2xl flex flex-col items-center justify-center gap-4 font-mono">
            <Activity className="w-8 h-8" />
            SISTEMA OFFLINE. FALHA NA RESOLUÇÃO GEOCÊNTRICA.
          </div>
        ) : isLoading ? (
          <div className="grow flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="font-mono text-sm uppercase tracking-widest text-violet-400 animate-pulse">
              Sincronizando coordenadas da frota...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 grow min-h-0">
            
            {/* SIDEBAR: Frota (Master) */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-violet-900/30 bg-violet-950/20 text-xs font-mono text-cyan-400 uppercase tracking-widest flex justify-between items-center">
                <span className="flex items-center gap-2"><Orbit className="w-4 h-4" /> Frota Ativa</span>
                <span className="bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">{filteredSats.length}</span>
              </div>
              
              <div className="grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredSats.map((sat) => {
                  const isActive = selectedSat?.Id === sat.Id;
                  return (
                    <button
                      key={sat.Id}
                      onClick={() => setSelectedSat(sat)}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group ${
                        isActive 
                          ? "bg-violet-900/40 border border-violet-500/50 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]" 
                          : "border border-transparent hover:bg-violet-900/20"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <h3 className={`font-bold font-mono text-sm truncate ${isActive ? "text-cyan-300" : "text-violet-100 group-hover:text-cyan-100"}`}>
                          {sat.Name}
                        </h3>
                        <p className="text-xs text-violet-500/70 font-mono mt-1">
                          ID: {sat.Id}
                        </p>
                      </div>
                      {isActive && <LocateFixed className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PAINEL PRINCIPAL: Radar e Telemetria (Detail) */}
            <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              
              <AnimatePresence mode="wait">
                {selectedSat ? (
                  <motion.div
                    key={selectedSat.Id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col xl:flex-row gap-6 h-full"
                  >
                    
                    {/* O RADAR (Visualização) */}
                    <div className="w-full xl:w-1/2 bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-100 overflow-hidden">
                      {/* Círculos do Radar */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 rounded-full border border-violet-500/20 absolute" />
                        <div className="w-48 h-48 rounded-full border border-violet-500/30 absolute" />
                        <div className="w-32 h-32 rounded-full border border-violet-500/40 absolute" />
                        <div className="w-2 h-2 rounded-full bg-cyan-400 absolute shadow-[0_0_15px_rgba(34,211,238,1)]" />
                        
                        {/* Linha de Varredura (Animação pura no Tailwind) */}
                        <div className="w-32 h-32 absolute top-1/2 left-1/2 origin-top-left border-l-2 border-cyan-400/50 bg-linear-to-br from-cyan-400/10 to-transparent animate-spin-slow" />
                      </div>

                      {/* Info do Radar */}
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-red-400 tracking-widest uppercase">Rastreando</span>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 text-right">
                        <span className="block text-[10px] font-mono text-violet-500/60 uppercase tracking-widest">Alvo Atual</span>
                        <span className="text-sm font-mono text-cyan-400 font-bold">{selectedSat.Id}</span>
                      </div>
                    </div>

                    {/* DADOS DA SONDA (Telemetria) */}
                    <div className="w-full xl:w-1/2 flex flex-col gap-4">
                      
                      {/* Card de Título */}
                      <div className="bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl p-8 backdrop-blur-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-900/20 border border-cyan-900/50 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                          <Crosshair className="w-3.5 h-3.5" />
                          Lock Estabelecido
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                          {selectedSat.Name}
                        </h2>
                        <p className="text-violet-400 font-mono text-sm border-t border-violet-900/50 pt-4 mt-4">
                          Sistema Integrado de Situação de Satélites
                        </p>
                      </div>

                      {/* Grid de Metadados */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grow">
                        
                        <div className="bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl p-6 flex flex-col justify-center">
                          <span className="text-xs text-violet-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4" /> Lançamento / Início
                          </span>
                          <span className="text-xl text-violet-100 font-mono">
                            {formatOrbitalDate(selectedSat.StartTime)}
                          </span>
                        </div>

                        <div className="bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl p-6 flex flex-col justify-center">
                          <span className="text-xs text-violet-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4" /> Fim das Operações
                          </span>
                          <span className="text-xl text-cyan-300 font-mono">
                            {formatOrbitalDate(selectedSat.EndTime)}
                          </span>
                        </div>

                        <div className="bg-[#0a0718]/80 border border-violet-900/30 rounded-2xl p-6 sm:col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-violet-500 uppercase tracking-widest font-mono block mb-1">
                              Resolução do Fator Geocêntrico
                            </span>
                            <span className="text-lg text-white font-mono flex items-center gap-2">
                              {selectedSat.Resolution} <span className="text-violet-500 text-sm">unidades</span>
                            </span>
                          </div>
                          <Orbit className="w-10 h-10 text-violet-900/50" />
                        </div>

                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-violet-800 font-mono border border-violet-900/20 rounded-2xl border-dashed">
                    SELECIONE UMA SONDA NA FROTA PARA INICIAR RASTREIO
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
