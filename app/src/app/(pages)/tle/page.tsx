"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, ChevronRight, Cpu, Terminal } from "lucide-react";
import axios from "axios";


// Tipagem do TLE Set
type TleData = {
  satelliteId: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
};


const fetchTleData = async (query: string): Promise<TleData[]> => {
  const res = await axios.get<TleData[]>(`/api/tle?q=${query}`);
  return res.data;
};


// Um mini-parser TLE direto no Frontend
// O formato TLE tem posições fixas de caracteres. A Linha 2 é a mais rica em parâmetros orbitais.
const decodeTleLine2 = (line2: string) => {
  if (!line2 || line2.length < 68) return null;
  return {
    inclination: line2.substring(8, 16).trim(),    // Inclinação da órbita (graus)
    raan: line2.substring(17, 25).trim(),          // Ascensão Reta do Nodo Ascendente
    eccentricity: "0." + line2.substring(26, 33),  // Excentricidade (vem sem o "0." original)
    perigee: line2.substring(34, 42).trim(),       // Argumento do Perigeu
    meanAnomaly: line2.substring(43, 51).trim(),   // Anomalia Média
    meanMotion: line2.substring(52, 63).trim(),    // Movimento Médio (órbitas por dia)
  };
};


export default function TlePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("25544"); // Começa rastreando a ISS

  const { data: tleSets, isLoading, error, isFetching } = useQuery({
    queryKey: ["tle-data", searchQuery],
    queryFn: () => fetchTleData(searchQuery),
  });

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setSearchInput(""); // Limpa o terminal após enviar o comando
    }
  };


  return (
    <div className="min-h-screen text-emerald-500 font-mono pt-12 pb-24 px-4 sm:px-8 relative selection:bg-emerald-500 selection:text-black">
      
      {/* Efeito visual retro de "Scanline" sobre toda a tela (Simulando monitor CRT) */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,255,100,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col h-full min-h-[80vh]">
        
        {/* HEADER DO TERMINAL */}
        <div className="flex justify-between items-end border-b-2 border-emerald-900 pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-widest flex items-center gap-3">
              <Terminal className="w-6 h-6" /> TLE_ORBITAL_DECODER
            </h1>
            <p className="text-emerald-700 text-xs mt-2 uppercase tracking-widest">
              Conexão Segura Estabelecida // CelesTrak Interface
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-emerald-700 text-xs block mb-1">Status de Conexão</span>
            <span className="flex items-center gap-2 text-sm">
              [ <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> ONLINE ]
            </span>
          </div>
        </div>

        {/* ÁREA PRINCIPAL DO CONSOLE */}
        <div className="grow flex flex-col gap-8">
          
          {/* Output History (Resultados) */}
          <div className="grow flex flex-col gap-12">
            
            {error && (
              <div className="bg-red-950/20 text-red-500 border border-red-900 p-6 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]">
                &gt; ERRO_FATAL: {error.message}
                <br />&gt; ABORTANDO_OPERAÇÃO.
              </div>
            )}

            {(isLoading || isFetching) && (
              <div className="text-emerald-400/70 animate-pulse">
                &gt; Inicializando varredura de radar para NORAD_ID / NOME: &quot;{searchQuery}&quot;...
                <br />&gt; Interceptando pacotes orbitais... aguarde.
              </div>
            )}

            <AnimatePresence>
              {!isLoading && !isFetching && !error && tleSets?.map((tle, index) => {
                const decoded = decodeTleLine2(tle.line2);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={tle.satelliteId + index}
                    className="flex flex-col gap-4 border border-emerald-900/50 p-6 bg-emerald-950/5 relative"
                  >
                    {/* Bloco de Nome e Data */}
                    <div className="flex justify-between items-start mb-2 border-b border-emerald-900/50 pb-4">
                      <div>
                        <div className="text-xs text-emerald-700 uppercase mb-1">Identificação do Alvo</div>
                        <div className="text-xl font-bold text-white tracking-wider">{tle.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-700 uppercase mb-1">Época TLE (Timestamp)</div>
                        <div className="text-sm">{new Date(tle.date).toLocaleString('pt-BR')}</div>
                      </div>
                    </div>

                    {/* BLOCO TLE CRU (Raw Data) */}
                    <div>
                      <div className="text-xs text-emerald-700 uppercase mb-2 flex items-center gap-2">
                        <Binary className="w-4 h-4" /> Two-Line Element Set Cru
                      </div>
                      <div className="bg-black border border-emerald-900 p-4 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto whitespace-nowrap shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                        <div>{tle.line1}</div>
                        <div>{tle.line2}</div>
                      </div>
                    </div>

                    {/* DECODER VISUAL (Parâmetros Extraídos) */}
                    {decoded && (
                      <div className="mt-4 pt-4 border-t border-emerald-900/50">
                        <div className="text-xs text-emerald-700 uppercase mb-4 flex items-center gap-2">
                          <Cpu className="w-4 h-4" /> Decodificação de Telemetria (Linha 2)
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                          <div>
                            <span className="block text-[10px] text-emerald-600 mb-1">INCLINAÇÃO (GRAUS)</span>
                            <span className="text-lg text-emerald-300">{decoded.inclination}°</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-600 mb-1">EXCENTRICIDADE DA ÓRBITA</span>
                            <span className="text-lg text-emerald-300">{decoded.eccentricity}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-600 mb-1">MOVIMENTO MÉDIO (VOLTAS/DIA)</span>
                            <span className="text-lg text-emerald-300">{decoded.meanMotion}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-600 mb-1">ANOMALIA MÉDIA</span>
                            <span className="text-lg text-emerald-300">{decoded.meanAnomaly}°</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-600 mb-1">ARGUMENTO DO PERIGEU</span>
                            <span className="text-lg text-emerald-300">{decoded.perigee}°</span>
                          </div>
                          <div className="hidden lg:block">
                            <span className="block text-[10px] text-emerald-600 mb-1">ASCENSÃO RETA (RAAN)</span>
                            <span className="text-lg text-emerald-300">{decoded.raan}°</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {!isLoading && !isFetching && tleSets && tleSets.length === 0 && (
              <div className="text-emerald-700">
                &gt; NENHUM_SATÉLITE_ENCONTRADO. Verifique o NORAD ID ou nome do alvo.
              </div>
            )}
          </div>

        </div>

        {/* INPUT DE COMANDO (Fixado na base) */}
        <div className="mt-12 bg-black border-t-2 border-emerald-900 pt-6">
          <form onSubmit={handleCommand} className="flex flex-col gap-2">
            <label className="text-xs text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-500" />
              Insira o NORAD ID (Ex: 25544, 20580) ou Nome do Satélite
            </label>
            <div className="flex items-center group bg-black border border-emerald-900 focus-within:border-emerald-500 transition-colors">
              <span className="pl-4 pr-2 text-emerald-500">root@orbit-tracker:~#</span>
              <input 
                type="text" 
                autoFocus
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={isLoading || isFetching}
                className="w-full bg-transparent text-emerald-400 p-3 outline-none disabled:opacity-50"
                placeholder="aguardando_input_do_usuario_"
              />
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
