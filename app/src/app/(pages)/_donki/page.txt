"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, AlertOctagon, Flame, Loader2, Search, Sun, ThermometerSun, Clock } from "lucide-react";
import axios from "axios";


// Tipagem da API DONKI (Solar Flares)
type SolarFlare = {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
};

const fetchSolarFlares = async (startDate: string, endDate: string): Promise<SolarFlare[]> => {
  const res = await axios.get<SolarFlare[]>(`/api/donki?startDate=${startDate}&endDate=${endDate}`);
  return res.data;
};


// Utilitários de Data para pegar os últimos 7 dias como padrão
const todayStr = new Date().toISOString().split("T")[0];
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const weekAgoStr = sevenDaysAgo.toISOString().split("T")[0];


// Função para definir a cor baseada na classe da erupção
const getFlareStyle = (classType: string) => {
  const letter = classType.charAt(0).toUpperCase();
  switch (letter) {
    case 'X': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]' };
    case 'M': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' };
    case 'C': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: '' };
    default: return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', glow: '' }; // A ou B
  }
};


// Formatação amigável de data e hora
const formatDateTime = (isoString: string) => {
  if (!isoString) return "Em andamento";
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', ' às');
};


export default function DonkiPage() {
  const [startInput, setStartInput] = useState(weekAgoStr);
  const [endInput, setEndInput] = useState(todayStr);
  const [searchParams, setSearchParams] = useState({ start: weekAgoStr, end: todayStr });

  const { data: flares, isLoading, isFetching, error } = useQuery({
    queryKey: ["donki-flares", searchParams],
    queryFn: () => fetchSolarFlares(searchParams.start, searchParams.end),
  });

  const handleSearch = () => {
    setSearchParams({ start: startInput, end: endInput });
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-600/5 blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER: Controles do Observatório */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl mb-12 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-full border border-orange-500/20">
                <Sun className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-white drop-shadow-sm">Atividade Solar</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4" /> Relatório de Erupções (DONKI)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Início</label>
              <input 
                type="date" max={todayStr} value={startInput} onChange={(e) => setStartInput(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Fim</label>
              <input 
                type="date" max={todayStr} value={endInput} onChange={(e) => setEndInput(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button 
                onClick={handleSearch} disabled={isLoading || isFetching}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/30 text-white h-11.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4" /> ATUALIZAR DADOS</>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* MENSAGENS DE ESTADO */}
        {error && (
          <div className="p-6 border border-rose-500/30 bg-rose-500/10 rounded-2xl text-rose-400 flex items-center gap-4">
            <AlertOctagon className="w-8 h-8" />
            <p>Os sensores de radiação estão inoperantes. Não foi possível contactar a base de dados.</p>
          </div>
        )}

        {!isLoading && !isFetching && flares?.length === 0 && (
          <div className="p-12 border border-white/5 bg-white/5 rounded-2xl text-muted-foreground text-center flex flex-col items-center">
            <Sun className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">Nenhuma erupção solar detectada neste período.</p>
            <p className="text-sm">O clima espacial encontra-se estável.</p>
          </div>
        )}

        {/* TIMELINE DE EVENTOS */}
        {!error && flares && flares.length > 0 && (
          <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12 pb-12">
            {flares.map((flare, index) => {
              const styles = getFlareStyle(flare.classType);
              
              return (
                <motion.div 
                  key={flare.flrID}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 md:pl-12"
                >
                  {/* Ponto da Timeline */}
                  <div className={`absolute -left-2.75 top-2 w-5 h-5 rounded-full border-4 border-background ${styles.bg} flex items-center justify-center ${styles.glow}`}>
                    <div className={`w-2 h-2 rounded-full ${styles.bg.replace('/10', '')}`} />
                  </div>

                  {/* Card do Evento */}
                  <div className={`p-6 rounded-2xl border bg-black/40 backdrop-blur-md transition-all hover:-translate-y-1 ${styles.border} group`}>
                    
                    {/* Header do Card */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Flame className={`w-5 h-5 ${styles.color}`} />
                          <h3 className={`text-xl font-bold font-mono tracking-tight ${styles.color}`}>
                            Classe {flare.classType}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">ID: {flare.flrID}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <ThermometerSun className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Região: {flare.sourceLocation || "Desconhecida"}</span>
                      </div>
                    </div>

                    {/* Dados de Tempo */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Início
                        </span>
                        <span className="font-medium text-white/90">{formatDateTime(flare.beginTime)}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-orange-500/70" /> Pico de Energia
                        </span>
                        <span className="font-medium text-white/90">{formatDateTime(flare.peakTime)}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-3 h-3" /> Fim
                        </span>
                        <span className="font-medium text-white/90">{formatDateTime(flare.endTime)}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
