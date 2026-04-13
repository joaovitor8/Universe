"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, ShieldAlert, ShieldCheck, Target, Activity,ArrowDownAZ,Search } from "lucide-react";
import axios from "axios";


// Tipagem da API Sentry (JPL)
type SentryObject = {
  des: string;           // Designação (Nome do Asteroide)
  ip: string;            // Probabilidade de Impacto (ex: 1e-5)
  range: string;         // Anos dos possíveis impactos (ex: "2024-2111")
  ps_cum: string;        // Escala Palermo Cumulativa
  diameter: string;      // Diâmetro em km
  n_imp: number;         // Número de impactos potenciais
  v_inf: string;         // Velocidade de impacto (km/s)
  last_obs: string;      // Última observação
};


type SentryResponse = {
  count: string;
  signature: { version: string; source: string };
  objects: SentryObject[];
};


const fetchSentryData = async (): Promise<SentryResponse> => {
  const res = await axios.get<SentryResponse>("/api/cneos");
  return res.data;
};


// Função para renderizar um medidor visual baseado na Escala Palermo (PS)
// A Escala Palermo compara o risco do asteroide com o "risco de fundo" (background hazard).
// Valores menores que -2 são ignoráveis. Entre -2 e 0 merecem observação. Acima de 0 são preocupantes.
const getThreatLevel = (psValue: string) => {
  const ps = parseFloat(psValue);
  if (ps < -4) return { label: "Mínimo", color: "bg-zinc-500", text: "text-zinc-400", width: "w-1/4" };
  if (ps < -2) return { label: "Baixo", color: "bg-yellow-600", text: "text-yellow-500", width: "w-2/4" };
  if (ps < 0) return { label: "Elevado", color: "bg-orange-500", text: "text-orange-500", width: "w-3/4" };
  return { label: "Crítico", color: "bg-red-500", text: "text-red-500", width: "w-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" };
};


export default function CneosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"ps" | "prob">("ps");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cneos-sentry"],
    queryFn: fetchSentryData,
  });

  // Filtra e Ordena os dados
  const processedObjects = data?.objects
    ?.filter(obj => obj.des.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "ps") {
        return parseFloat(b.ps_cum) - parseFloat(a.ps_cum); // Maior Palermo primeiro
      } else {
        return parseFloat(b.ip) - parseFloat(a.ip); // Maior probabilidade primeiro
      }
    }) || [];


  return (
    <div className="min-h-screen text-zinc-300 font-sans pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background de Ameaça (Glow vermelho escuro muito sutil) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-red-900/5 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* HEADER: Comando Central */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-red-900/20 pb-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/50">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-1">
                Defesa Planetária
              </h1>
              <p className="text-sm text-red-500/70 flex items-center gap-2 font-mono uppercase tracking-widest">
                <Target className="w-4 h-4" /> Sentry Impact Risk Matrix
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Campo de Busca */}
            <div className="relative group grow">
              <input 
                type="text" 
                placeholder="Designação do objeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-[#0a0a0a] text-zinc-100 border border-red-900/30 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-red-500/50 transition-all font-mono text-sm"
              />
              <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
            </div>

            {/* Ordenação */}
            <button 
              onClick={() => setSortBy(sortBy === "ps" ? "prob" : "ps")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono uppercase tracking-widest transition-colors shrink-0"
            >
              <ArrowDownAZ className="w-4 h-4" />
              {sortBy === "ps" ? "Escala Palermo" : "Probabilidade"}
            </button>
          </div>
        </motion.div>

        {/* ESTATÍSTICAS GERAIS (HUD) */}
        {!isLoading && !error && data && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Ameaças Ativas</p>
                <p className="text-3xl font-light text-white">{data.count}</p>
              </div>
              <Activity className="w-8 h-8 text-red-900/50" />
            </div>
            
            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Risco Crítico Imediato</p>
                <p className="text-3xl font-light text-green-500 flex items-center gap-2">
                  0 <ShieldCheck className="w-6 h-6" />
                </p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Base de Dados</p>
                <p className="text-sm font-mono text-zinc-300 mt-2">{data.signature.source}</p>
                <p className="text-[10px] font-mono text-zinc-600 mt-1">v.{data.signature.version}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ESTADOS DE CARREGAMENTO / ERRO */}
        {error && (
          <div className="p-8 border border-red-900/50 bg-red-950/20 text-red-500 rounded-2xl flex flex-col items-center justify-center gap-4 font-mono text-center">
            <AlertTriangle className="w-10 h-10" />
            SISTEMA DE ALERTA INDISPONÍVEL. NÃO É POSSÍVEL CALCULAR ROTAS DE COLISÃO.
          </div>
        )}

        {isLoading && (
          <div className="grow flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="font-mono text-sm uppercase tracking-widest text-red-500/70 animate-pulse">
              Calculando trajetórias de impacto...
            </p>
          </div>
        )}

        {/* MATRIZ DE DADOS (A Tabela) */}
        {!isLoading && !error && processedObjects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 border-b border-red-900/30 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    <th className="p-6 font-medium">Designação</th>
                    <th className="p-6 font-medium">Anos Potenciais</th>
                    <th className="p-6 font-medium hidden md:table-cell">Impactos</th>
                    <th className="p-6 font-medium hidden lg:table-cell">Velocidade</th>
                    <th className="p-6 font-medium">Probabilidade</th>
                    <th className="p-6 font-medium w-64">Escala Palermo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  <AnimatePresence>
                    {processedObjects.map((obj, index) => {
                      const threat = getThreatLevel(obj.ps_cum);
                      const probPercent = (parseFloat(obj.ip) * 100).toFixed(6);

                      return (
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (index % 15) * 0.05 }}
                          key={obj.des} 
                          className="hover:bg-red-950/10 transition-colors group"
                        >
                          {/* Nome do Objeto */}
                          <td className="p-6">
                            <div className="font-mono text-white font-bold text-base flex items-center gap-2">
                              {obj.des}
                            </div>
                            <div className="text-xs text-zinc-600 font-mono mt-1">
                              Diâmetro: {obj.diameter ? `${obj.diameter} km` : "Desconhecido"}
                            </div>
                          </td>

                          {/* Range de Anos */}
                          <td className="p-6 font-mono text-sm text-zinc-400">
                            {obj.range}
                          </td>

                          {/* Número de Impactos */}
                          <td className="p-6 font-mono text-sm text-zinc-400 hidden md:table-cell">
                            {obj.n_imp}
                          </td>

                          {/* Velocidade */}
                          <td className="p-6 font-mono text-sm text-zinc-400 hidden lg:table-cell">
                            {obj.v_inf} km/s
                          </td>

                          {/* Probabilidade */}
                          <td className="p-6">
                            <div className="font-mono text-sm text-zinc-300">
                              {obj.ip}
                            </div>
                            <div className="text-xs text-zinc-600 font-mono mt-1">
                              {probPercent}%
                            </div>
                          </td>

                          {/* Medidor Palermo */}
                          <td className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-bold uppercase tracking-widest ${threat.text}`}>
                                {threat.label}
                              </span>
                              <span className="text-xs font-mono text-zinc-500">
                                {obj.ps_cum}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${threat.color} ${threat.width}`} 
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}