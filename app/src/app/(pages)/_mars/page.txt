"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertOctagon, ArrowDown, ArrowUp, Gauge, Loader2, RadioTower, ThermometerSun, Wind } from "lucide-react";
import axios from "axios";


// Tipagem complexa da API InSight
type SensorData = {
  av: number; // Average
  mn: number; // Minimum
  mx: number; // Maximum
};

type SolData = {
  AT?: SensorData; // Atmospheric Temperature
  HWS?: SensorData; // Horizontal Wind Speed
  PRE?: SensorData; // Atmospheric Pressure
  First_UTC: string;
  Season: string;
};

type MarsWeatherResponse = {
  sol_keys: string[];
  [key: string]: SolData | string[] | any; // O JSON mistura sol_keys com os objetos Sol
};


const fetchMarsWeather = async (): Promise<MarsWeatherResponse> => {
  const res = await axios.get<MarsWeatherResponse>("/api/mars");
  return res.data;
};


export default function MarsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mars-weather"],
    queryFn: fetchMarsWeather,
    staleTime: Infinity, // Os dados são históricos e não vão mudar
  });

  // Estado para armazenar qual Sol (dia marciano) está sendo visualizado
  const [activeSol, setActiveSol] = useState<string | null>(null);

  // Assim que os dados carregam, selecionamos o Sol mais recente (o último do array)
  useEffect(() => {
    if (data?.sol_keys && data.sol_keys.length > 0 && !activeSol) {
      setActiveSol(data.sol_keys[data.sol_keys.length - 1]);
    }
  }, [data, activeSol]);

  const solData: SolData | null = activeSol && data ? data[activeSol] : null;

  return (
    <div className="min-h-screen text-orange-50 font-sans flex flex-col pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Atmosfera Marciana (Fundo) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-900/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-[-10%] w-[60vw] h-[40vw] rounded-full bg-red-900/5 blur-[120px] pointer-events-none -z-10" />

      {/* Grade de Radar Simulada */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto w-full grow flex flex-col relative z-10">
        
        {/* HEADER DO CONSOLE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-orange-900/30 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-950/50 rounded-xl border border-orange-800/50 text-orange-500">
              <RadioTower className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-orange-500 uppercase">
                Base InSight
              </h1>
              <p className="text-xs font-mono text-orange-400/60 tracking-widest uppercase mt-1">
                Elysium Planitia • Arquivo Histórico
              </p>
            </div>
          </div>

          <div className="bg-orange-950/30 border border-orange-900/50 px-4 py-2 rounded-lg backdrop-blur-sm text-right">
            <span className="block text-[10px] font-mono text-orange-500/60 uppercase tracking-widest mb-1">
              Status da Missão
            </span>
            <span className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              CONCLUÍDA (1.440 SOLS)
            </span>
          </div>
        </div>

        {/* TRATAMENTO DE ERROS / LOADING */}
        {error && (
          <div className="p-8 border border-red-900/50 bg-red-950/30 text-red-500 rounded-2xl flex flex-col items-center justify-center gap-4 mt-10">
            <AlertOctagon className="w-12 h-12" />
            <p className="font-mono text-center">FALHA DE COMUNICAÇÃO. VERIFIQUE OS RELÉS DA DEEP SPACE NETWORK.</p>
          </div>
        )}

        {isLoading && (
          <div className="grow flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            <p className="font-mono text-sm tracking-widest text-orange-500/70 animate-pulse">
              DECODIFICANDO TELEMETRIA...
            </p>
          </div>
        )}

        {/* PAINEL PRINCIPAL DE LEITURA (READOUT) */}
        {!isLoading && !error && solData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grow flex flex-col"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* BLOCO CENTRAL: Temperatura (Ocupa 8 colunas) */}
              <div className="lg:col-span-8 bg-orange-950/20 border border-orange-900/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ThermometerSun className="w-64 h-64" />
                </div>

                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-orange-900/30 text-orange-500 text-xs font-mono font-bold tracking-widest border border-orange-800/30 mb-4">
                      SOL {activeSol}
                    </span>
                    <h2 className="text-xl font-mono text-orange-400/80 uppercase tracking-widest">
                      Temperatura Atmosférica
                    </h2>
                    <p className="text-sm text-orange-500/50 font-mono mt-1">
                      Data Terrestre: {new Date(solData.First_UTC).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-orange-500/60 uppercase tracking-widest block">Estação</span>
                    <span className="text-lg font-bold text-orange-400 capitalize">{solData.Season}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-12">
                  <div className="flex items-start">
                    <span className="text-8xl md:text-[140px] font-bold tracking-tighter leading-none text-orange-500">
                      {solData.AT ? Math.round(solData.AT.av) : "N/A"}
                    </span>
                    <span className="text-4xl md:text-6xl font-light text-orange-600 mt-2">°C</span>
                  </div>

                  {solData.AT && (
                    <div className="flex gap-6 pb-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-orange-500/50 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <ArrowUp className="w-3 h-3 text-orange-500" /> Máxima
                        </span>
                        <span className="text-3xl font-bold text-orange-400">{Math.round(solData.AT.mx)}°</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-orange-500/50 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <ArrowDown className="w-3 h-3 text-blue-400" /> Mínima
                        </span>
                        <span className="text-3xl font-bold text-blue-400">{Math.round(solData.AT.mn)}°</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BLOCO LATERAL: Vento e Pressão (Ocupa 4 colunas) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Vento */}
                <div className="bg-orange-950/20 border border-orange-900/30 rounded-3xl p-6 backdrop-blur-md grow">
                  <div className="flex items-center gap-2 mb-6">
                    <Wind className="w-5 h-5 text-orange-500" />
                    <h3 className="font-mono text-sm text-orange-400/80 uppercase tracking-widest">Velocidade do Vento</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tighter text-orange-500">
                      {solData.HWS ? solData.HWS.av.toFixed(1) : "N/A"}
                    </span>
                    {solData.HWS && <span className="text-lg text-orange-600 mb-1">m/s</span>}
                  </div>
                </div>

                {/* Pressão */}
                <div className="bg-orange-950/20 border border-orange-900/30 rounded-3xl p-6 backdrop-blur-md grow">
                  <div className="flex items-center gap-2 mb-6">
                    <Gauge className="w-5 h-5 text-orange-500" />
                    <h3 className="font-mono text-sm text-orange-400/80 uppercase tracking-widest">Pressão Atmosférica</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tighter text-orange-500">
                      {solData.PRE ? Math.round(solData.PRE.av) : "N/A"}
                    </span>
                    {solData.PRE && <span className="text-lg text-orange-600 mb-1">Pa</span>}
                  </div>
                </div>

              </div>
            </div>

            {/* SELETOR DE SOLS (TIMELINE INFERIOR) */}
            <div className="mt-auto">
              <h3 className="text-xs font-mono text-orange-500/60 uppercase tracking-widest mb-4">
                Registros Anteriores Disponíveis
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.sol_keys.map((sol) => {
                  const isActive = activeSol === sol;
                  return (
                    <button
                      key={sol}
                      onClick={() => setActiveSol(sol)}
                      className={`px-6 py-3 rounded-xl font-mono text-sm transition-all border ${
                        isActive 
                          ? "bg-orange-600 text-white border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.3)]" 
                          : "bg-orange-950/30 text-orange-500/70 border-orange-900/50 hover:bg-orange-900/40 hover:text-orange-400"
                      }`}
                    >
                      SOL {sol}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
