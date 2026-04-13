"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  Compass, 
  Crosshair, 
  Globe, 
  Layers, 
  Loader2, 
  Map as MapIcon, 
  ZoomIn, 
  ZoomOut 
} from "lucide-react";
import axios from "axios";

// Tipagem da nossa configuração
type TrekConfig = {
  name: string;
  body: string;
  layer: string;
  format: string;
  maxZoom: number;
};

const fetchTrekConfig = async (target: string): Promise<TrekConfig> => {
  const res = await axios.get<TrekConfig>(`/api/trek?target=${target}`);
  return res.data;
};

// Construtor do URL do Azulejo (Tile) da NASA
const buildTileUrl = (config: TrekConfig, z: number, y: number, x: number) => {
  // Impede que as coordenadas saiam dos limites lógicos (evita erros 404 agressivos)
  const maxTiles = Math.pow(2, z);
  if (y < 0 || y >= maxTiles || x < 0 || x >= maxTiles * 2) {
    return "/tile-empty.png"; // Um fallback transparente ou escuro caso saia do mapa
  }
  return `https://trek.nasa.gov/tiles/${config.body}/EQ/${config.layer}/1.0.0//default/default028mm/${z}/${y}/${x}.${config.format}`;
};

export default function TrekPage() {
  const [target, setTarget] = useState<"moon" | "mars" | "vesta">("mars");
  
  // Estado de Navegação do Mapa (Z = Zoom, X = Coluna, Y = Linha)
  const [z, setZ] = useState(2);
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);

  const { data: config, isLoading } = useQuery({
    queryKey: ["trek-config", target],
    queryFn: () => fetchTrekConfig(target),
  });

  // Controlos de Movimento
  const moveMap = (dx: number, dy: number) => {
    setX(prev => prev + dx);
    setY(prev => prev + dy);
  };

  const handleZoom = (dz: number) => {
    if (!config) return;
    const newZ = z + dz;
    if (newZ >= 1 && newZ <= config.maxZoom) {
      setZ(newZ);
      // Ajusta o X e Y para manter o centro proporcional
      if (dz > 0) {
        setX(prev => prev * 2);
        setY(prev => prev * 2);
      } else {
        setX(prev => Math.floor(prev / 2));
        setY(prev => Math.floor(prev / 2));
      }
    }
  };

  // Os 9 blocos da nossa grelha 3x3 (A perspetiva de câmara)
  const gridOffsets = [
    [-1, -1], [0, -1], [1, -1], // Topo (Esquerda, Centro, Direita)
    [-1, 0],  [0, 0],  [1, 0],  // Meio
    [-1, 1],  [0, 1],  [1, 1]   // Fundo
  ];

  return (
    <div className="min-h-screen text-slate-300 pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background Topográfico */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto w-full flex-grow flex flex-col h-[calc(100vh-8rem)]">
        
        {/* HEADER: Mesa de Luz */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-800 pb-6 shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
              <MapIcon className="w-8 h-8 text-slate-100" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
                Cartografia Planetária
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-2 font-mono uppercase tracking-widest">
                <Layers className="w-4 h-4" /> Web Map Tile Service (WMTS)
              </p>
            </div>
          </div>

          {/* Seletor de Corpo Celeste */}
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
            {(["moon", "mars", "vesta"] as const).map((body) => (
              <button
                key={body}
                onClick={() => {
                  setTarget(body);
                  setZ(2); setX(2); setY(1); // Reset da perspetiva
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-xs font-mono uppercase tracking-widest transition-all ${
                  target === body 
                    ? "bg-slate-700 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Globe className="w-4 h-4" />
                {body === "moon" ? "Lua" : body === "mars" ? "Marte" : "Vesta"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ÁREA DE OPERAÇÃO (O Mapa + Controlos) */}
        <div className="flex flex-col lg:flex-row gap-8 flex-grow min-h-0">
          
          {/* MESA DE PROJEÇÃO (O Motor de Tiles Customizado) */}
          <div className="w-full lg:w-3/4 bg-[#050505] border border-slate-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
            
            {/* Mira Central (Crosshair) */}
            <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-cyan-500 absolute" />
              <div className="w-[1px] h-full bg-cyan-500 absolute" />
              <Crosshair className="w-12 h-12 text-cyan-400" />
            </div>

            {/* Grelha de Tiles 3x3 */}
            {isLoading || !config ? (
              <Loader2 className="w-12 h-12 text-slate-600 animate-spin" />
            ) : (
              <div className="grid grid-cols-3 grid-rows-3 w-[768px] h-[768px] scale-[0.6] sm:scale-75 md:scale-100 transition-transform origin-center">
                {gridOffsets.map(([dx, dy], index) => {
                  const tileX = x + dx;
                  const tileY = y + dy;
                  const url = buildTileUrl(config, z, tileY, tileX);
                  
                  return (
                    <div key={`${target}-${z}-${tileX}-${tileY}-${index}`} className="w-[256px] h-[256px] border-[0.5px] border-slate-900/30 bg-slate-950 flex items-center justify-center relative group">
                      {/* Imagem do WMTS */}
                      <img 
                        src={url} 
                        alt={`Tile ${tileX},${tileY}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => {
                          // Se o tile não existir (oceano ou fora do mapa), fica preto/vazio
                          (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; 
                        }}
                      />
                      {/* Debug Info (Oculto por defeito, visível no ecrã para dar ar técnico) */}
                      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-500/30 pointer-events-none uppercase">
                        Z{z}_X{tileX}_Y{tileY}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PAINEL DE TELEMETRIA E CONTROLO */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            
            {/* D-Pad de Navegação */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center backdrop-blur-md">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">Controlo de Eixos</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button onClick={() => moveMap(0, -1)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors active:scale-95 text-slate-300">
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div />
                <button onClick={() => moveMap(-1, 0)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors active:scale-95 text-slate-300">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="p-4 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-slate-600" />
                </div>
                <button onClick={() => moveMap(1, 0)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors active:scale-95 text-slate-300">
                  <ArrowRight className="w-6 h-6" />
                </button>
                <div />
                <button onClick={() => moveMap(0, 1)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors active:scale-95 text-slate-300">
                  <ArrowDown className="w-6 h-6" />
                </button>
                <div />
              </div>
            </div>

            {/* Zoom e Telemetria */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 flex-grow">
              
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block">Nível de Zoom (Z)</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleZoom(-1)}
                    disabled={z <= 1}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-mono text-slate-300"
                  >
                    <ZoomOut className="w-4 h-4" /> Diminuir
                  </button>
                  <button 
                    onClick={() => handleZoom(1)}
                    disabled={z >= (config?.maxZoom || 5)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-mono text-slate-300"
                  >
                    <ZoomIn className="w-4 h-4" /> Ampliar
                  </button>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-800 pt-6 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Coordenada Central</span>
                  <span className="text-sm font-mono text-cyan-400">X: {x} | Y: {y}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Camada Ativa</span>
                  <span className="text-xs font-mono text-slate-400 truncate max-w-[150px]" title={config?.layer}>
                    {config?.layer}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
