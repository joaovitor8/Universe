"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {  Camera, Globe, Loader2, Pause, Play, Search } from "lucide-react";
import axios from "axios";


// Tipagem da API EPIC
type EpicImage = {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  centroid_coordinates: { lat: number; lon: number };
  dscovr_j2000_position: { x: number; y: number; z: number };
};


const fetchEpicData = async (date: string): Promise<EpicImage[]> => {
  const url = date ? `/api/epic?date=${date}` : "/api/epic";
  const res = await axios.get<EpicImage[]>(url);
  return res.data;
};


// Função para montar a URL da imagem baseada nos dados do satélite
const buildImageUrl = (item: EpicImage) => {
  // A data vem no formato "YYYY-MM-DD HH:MM:SS"
  const dateParts = item.date.split(" ")[0].split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  
  // Usamos jpg para carregar mais rápido, mas poderia ser png
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${item.image}.jpg`;
};

const todayStr = new Date().toISOString().split("T")[0];


export default function EpicPage() {
  const [tempDate, setTempDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  
  // Controles do Player
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: images, isLoading, error, isFetching } = useQuery({
    queryKey: ["epic", searchDate],
    queryFn: () => fetchEpicData(searchDate),
  });

  const handleSearch = () => {
    setSearchDate(tempDate);
    setCurrentIndex(0); // Reseta para a primeira foto do dia ao pesquisar
    setIsPlaying(false);
  };

  // Efeito para o Auto-Play da rotação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && images && images.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          // Se chegou no final, volta pro início (Loop)
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 1000); // Troca de frame a cada 1 segundo
    }

    return () => clearInterval(interval);
  }, [isPlaying, images]);

  // Se a busca terminar e não houver dados, o array será vazio
  const currentImage = images?.[currentIndex];
  const imageUrl = currentImage ? buildImageUrl(currentImage) : null;

  return (
    <div className="min-h-screen text-white flex flex-col pt-12 pb-24 px-4 sm:px-8 overflow-hidden relative">
      
      {/* Background estrelado sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10" />

      <div className="max-w-6xl mx-auto w-full flex flex-col items-center h-full">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest uppercase">Projeto EPIC</h1>
              <p className="text-sm text-blue-400 font-mono tracking-wider">Satélite DSCOVR - L1 Point</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
            <input 
              type="date" 
              max={todayStr}
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-transparent text-sm pl-4 pr-2 py-2 outline-none cursor-pointer appearance-none"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading || isFetching}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 rounded-full p-2.5 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-xl w-full text-center">
            Perda de telemetria com o satélite. Falha ao obter imagens.
          </div>
        )}

        {!error && images?.length === 0 && !isLoading && !isFetching && (
          <div className="p-8 border border-white/10 bg-white/5 text-muted-foreground rounded-2xl w-full text-center">
            Não há capturas disponíveis para esta data.
          </div>
        )}

        {/* ÁREA DO SENSOR (O GLOBO) */}
        <div className="relative w-full max-w-3xl aspect-square md:aspect-video flex items-center justify-center my-8">
          
          {(isLoading || isFetching) && (
            <div className="absolute z-20 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <span className="font-mono text-sm tracking-widest text-blue-400 animate-pulse">SINTONIZANDO DSCOVR...</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {imageUrl && (
              <motion.img 
                key={imageUrl}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
                src={imageUrl} 
                alt="Terra vista do espaço"
                className="w-full h-full object-contain rounded-full drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* CONTROLES DO PLAYER */}
        {images && images.length > 0 && !isLoading && !isFetching && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6"
          >
            {/* Metadados da Imagem Atual */}
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Captura de Imagem</span>
                <span className="text-lg font-mono text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  {currentImage?.date.split(" ")[1]} UTC
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Posição Central</span>
                <span className="text-sm font-mono text-white">
                  LAT: {currentImage?.centroid_coordinates.lat.toFixed(2)}° | LON: {currentImage?.centroid_coordinates.lon.toFixed(2)}°
                </span>
              </div>
            </div>

            {/* Painel de Controle (Timeline) */}
            <div className="flex items-center gap-6">
              
              {/* Botão Play/Pause */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>

              <div className="grow flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>Início do Dia</span>
                  <span>Quadro {currentIndex + 1} de {images.length}</span>
                  <span>Fim do Dia</span>
                </div>
                
                {/* O Slider de Navegação */}
                <input 
                  type="range" 
                  min="0" 
                  max={images.length - 1} 
                  value={currentIndex}
                  onChange={(e) => {
                    setIsPlaying(false); // Pausa se o usuário arrastar manualmente
                    setCurrentIndex(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}