/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Loader2, Camera, ArrowRight } from "lucide-react";
import axios from "axios";


type ApodData = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
};


const fetchApod = async (date: string): Promise<ApodData> => {
  const url = date ? `/api/apod?date=${date}` : "/api/apod";
  const response = await axios.get<ApodData>(url);
  return response.data;
};

const today = new Date().toISOString().split("T")[0];


export default function ApodPage() {
  const [tempDate, setTempDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["apod", searchDate],
    queryFn: () => fetchApod(searchDate),
  });

  const handleSearch = () => {
    setSearchDate(tempDate);
    setIsExpanded(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 pb-24 px-4 sm:px-8">

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <Camera className="w-5 h-5 text-primary" />
          <span className="font-serif tracking-widest uppercase text-sm">Galeria Espacial</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <input 
              type="date" 
              max={today}
              min="1995-06-16"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-black/20 text-foreground text-sm border border-white/10 rounded-l-full pl-6 pr-10 py-2.5 outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none"
            />
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={isLoading || isFetching || !tempDate}
            className="bg-primary hover:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-2.5 rounded-r-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            PESQUISAR
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="text-destructive font-mono text-center mt-20 animate-pulse">
          <p>ANOMALIA DETECTADA: Registro cósmico inacessível.</p>
        </div>
      )}

      {!error && (
        <main className="w-full max-w-5xl flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-4/3 md:aspect-video bg-black/40 border border-white/5 rounded-2xl p-2 md:p-4 shadow-2xl shadow-primary/5 flex items-center justify-center relative overflow-hidden"
          >
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}

            {data?.media_type === "image" ? (
              <img 
                src={data.hdurl || data.url} 
                alt={data.title}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : data?.media_type === "video" ? (
              <iframe 
                src={data.url} 
                title={data.title}
                className="w-full h-full rounded-xl"
                allowFullScreen
              />
            ) : null}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 text-center max-w-3xl flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight tracking-tight mb-6 drop-shadow-md">
              {data?.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground text-sm uppercase tracking-widest font-semibold border-y border-white/5 py-4 w-full justify-center">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {data?.date}</span>
              {data?.copyright && (
                <span className="opacity-60">© {data.copyright}</span>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-3xl mt-12 flex flex-col items-center"
          >
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-3 text-primary hover:text-white px-8 py-4 rounded-full transition-all border border-primary/20 hover:bg-primary/10 text-sm font-bold tracking-widest"
            >
              {isExpanded ? "OCULTAR DADOS" : "ABRIR REGISTROS TÉCNICOS"}
              {isExpanded ? <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full mt-8"
                >
                  <p className="text-lg text-muted-foreground leading-relaxed text-justify md:text-center font-light px-4 border-l-2 border-primary/20 italic">
                    {data?.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      )}
    </div>
  );
}
