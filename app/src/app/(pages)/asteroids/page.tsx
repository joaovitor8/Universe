"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, Radar, ShieldCheck, Target } from "lucide-react";
import axios from "axios";


type Asteroid = {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: { kilometers_per_hour: string };
    miss_distance: { kilometers: string; lunar: string };
  }>;
};

type NeoWsData = {
  element_count: number;
  near_earth_objects: Record<string, Asteroid[]>;
};


const fetchAsteroids = async (date: string): Promise<Asteroid[]> => {
  if (!date) return [];
  const res = await axios.get<NeoWsData>(`/api/asteroids?date=${date}`);
  return res.data.near_earth_objects[date] || [];
};

const today = new Date().toISOString().split("T")[0];


// Animações
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80 },
  },
};


export default function AsteroidsPage() {
  const [tempDate, setTempDate] = useState(today);
  const [searchDate, setSearchDate] = useState(today);

  const {
    data: asteroids,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["asteroids", searchDate],
    queryFn: () => fetchAsteroids(searchDate),
  });

  const handleSearch = () => {
    if (tempDate) setSearchDate(tempDate);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/10 pb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
            <Radar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wider">
              Monitoramento NEO
            </h1>
            <p className="text-sm text-muted-foreground">
              Objetos Próximos à Terra (NeoWs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <input
              type="date"
              max={today}
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-black/40 text-foreground text-sm border border-white/10 rounded-l-full pl-6 pr-10 py-2.5 outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || isFetching || !tempDate}
            className="bg-primary hover:bg-primary/80 disabled:bg-muted text-primary-foreground px-6 py-2.5 rounded-r-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            RASTREAR
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ESTADO: Erro ou Vazio */}
      {error && (
        <div className="w-full max-w-xl p-8 border border-destructive/30 bg-destructive/10 rounded-3xl text-destructive text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="font-bold text-lg mb-2">Falha no Radar</h3>
          <p>
            Não foi possível estabelecer conexão com a rede de monitoramento.
          </p>
        </div>
      )}

      {/* ESTADO: Loading */}
      {(isLoading || isFetching) && !error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <Radar className="w-10 h-10 text-primary animate-ping absolute opacity-50" />
            <Radar className="w-10 h-10 text-primary relative z-10" />
          </div>
          <p className="text-primary font-mono text-sm uppercase tracking-widest animate-pulse mt-4">
            Varrendo órbita terrestre...
          </p>
        </div>
      )}

      {/* ESTADO: Dados Carregados */}
      {!isLoading && !isFetching && !error && asteroids && (
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              {asteroids.length} Objetos Detectados em {searchDate}
            </h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {asteroids.map((asteroid) => {
              const isHazardous = asteroid.is_potentially_hazardous_asteroid;
              const velocity = parseFloat(
                asteroid.close_approach_data[0]?.relative_velocity
                  .kilometers_per_hour || "0",
              ).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
              const distance = parseFloat(
                asteroid.close_approach_data[0]?.miss_distance.kilometers ||
                  "0",
              ).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
              const size =
                asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                  0,
                );

              return (
                <motion.div
                  key={asteroid.id}
                  variants={item}
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-md p-6 flex flex-col justify-between min-h-62.5 transition-all hover:-translate-y-1 ${
                    isHazardous
                      ? "bg-destructive/5 border-destructive/30 hover:border-destructive"
                      : "bg-white/5 border-white/10 hover:border-primary/50"
                  }`}
                >
                  {/* Fundo Decorativo */}
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${isHazardous ? "bg-destructive" : "bg-primary"}`}
                  />

                  {/* Header do Card */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-foreground truncate max-w-50">
                        {asteroid.name.replace(/[()]/g, "")}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        ID: {asteroid.id}
                      </p>
                    </div>
                    {isHazardous ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/20 border border-destructive/50 text-destructive text-[10px] font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" />
                        Perigo
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        Seguro
                      </div>
                    )}
                  </div>

                  {/* Dados de Telemetria */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Tamanho Máx.
                      </span>
                      <span className="text-lg font-semibold text-foreground flex items-center gap-1">
                        {size}{" "}
                        <span className="text-xs text-muted-foreground">
                          metros
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Velocidade
                      </span>
                      <span className="text-sm font-mono text-foreground flex items-center gap-1">
                        {velocity}{" "}
                        <span className="text-xs text-muted-foreground">
                          km/h
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Target className="w-3 h-3" /> Distância
                      </span>
                      <span className="text-sm font-mono text-foreground flex items-center gap-1">
                        {distance}{" "}
                        <span className="text-xs text-muted-foreground">
                          km
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}
