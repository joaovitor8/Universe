/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Film, Library, Loader2, Search, X } from "lucide-react";
import axios from "axios";


// Tipagem baseada na estrutura da API da NASA
type NasaItem = {
  data: Array<{
    nasa_id: string;
    title: string;
    description: string;
    date_created: string;
    media_type: string;
  }>;
  links?: Array<{
    href: string; // Link da thumbnail da imagem
    rel: string;
  }>;
};


const fetchLibrary = async (query: string, mediaType: string): Promise<NasaItem[]> => {
  const res = await axios.get<NasaItem[]>(`/api/library?q=${query}&media_type=${mediaType}`);
  return res.data;
};


export default function LibraryPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("nebula");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  
  // Estado para o Modal de Imagem Expandida
  const [selectedItem, setSelectedItem] = useState<NasaItem | null>(null);

  const { data: items, isLoading, isFetching, error } = useQuery({
    queryKey: ["nasa-library", searchQuery, mediaType],
    queryFn: () => fetchLibrary(searchQuery, mediaType),
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
    }
  };

  // Função para limpar e formatar a descrição (a API às vezes manda textos muito longos)
  const formatDescription = (desc?: string) => {
    if (!desc) return "Sem descrição disponível.";
    return desc.length > 300 ? desc.substring(0, 300) + "..." : desc;
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 relative">
      
      {/* Background Decorativo */}
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-primary/10 to-transparent pointer-events-none -z-10" />

      <div className="max-w-400 mx-auto">
        
        {/* HEADER & MOTOR DE BUSCA */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <div className="p-4 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Library className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Arquivo Central
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Acesse milhares de imagens e vídeos históricos da NASA.
          </p>

          <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-4">
            <div className="relative grow group">
              <input 
                type="text" 
                placeholder="Ex: Apollo 11, Mars Rover, Orion Nebula..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-lg"
              />
              <Search className="w-6 h-6 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            </div>
            <button 
              type="submit"
              disabled={isLoading || isFetching}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-8 py-4 rounded-full font-bold tracking-wide transition-all active:scale-95 whitespace-nowrap"
            >
              BUSCAR
            </button>
          </form>

          {/* Filtros de Mídia */}
          <div className="flex items-center gap-4 mt-8 bg-white/5 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setMediaType("image")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                mediaType === "image" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" /> IMAGENS
            </button>
            <button
              onClick={() => setMediaType("video")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                mediaType === "video" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Film className="w-4 h-4" /> VÍDEOS
            </button>
          </div>
        </motion.div>

        {/* ÁREA DE RESULTADOS */}
        {error ? (
          <div className="text-center p-12 border border-destructive/30 bg-destructive/10 text-destructive rounded-3xl max-w-2xl mx-auto">
            Não foi possível conectar aos servidores de arquivo. Tente novamente.
          </div>
        ) : (isLoading || isFetching) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">
              Consultando arquivos...
            </p>
          </div>
        ) : items && items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl">Nenhum registro encontrado para &quot;{searchQuery}&quot;.</p>
          </div>
        ) : (
          /* MASONRY GRID (A Mágica do CSS) */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
          >
            {items?.map((item, index) => {
              const data = item.data?.[0];
              const imageUrl = item.links?.[0]?.href;

              // Ignora resultados sem imagem para não quebrar o layout visual
              if (!data || !imageUrl) return null;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }} // Efeito cascata leve
                  key={data.nasa_id}
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <img 
                    src={imageUrl} 
                    alt={data.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay Escuro com Título que aparece no Hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug">
                      {data.title}
                    </h3>
                    <p className="text-xs text-white/70 font-mono mt-1">
                      {new Date(data.date_created).getFullYear()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* MODAL DE IMAGEM EXPANDIDA (Lightbox) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedItem(null)} // Fecha ao clicar fora
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Evita que clique no card feche o modal
              className="bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row max-w-6xl w-full max-h-[90vh]"
            >
              {/* Foto Expandida */}
              <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4">
                <img 
                  src={selectedItem.links?.[0]?.href} 
                  alt={selectedItem.data[0].title}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-[85vh] rounded-xl"
                />
              </div>

              {/* Informações da Foto */}
              <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto custom-scrollbar border-t md:border-t-0 md:border-l border-white/10 bg-white/5">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    {selectedItem.data[0].media_type === "video" ? "Registro em Vídeo" : "Registro Fotográfico"}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-white mb-2 leading-tight">
                    {selectedItem.data[0].title}
                  </h2>
                  <div className="text-sm text-muted-foreground font-mono">
                    ID: {selectedItem.data[0].nasa_id} • {new Date(selectedItem.data[0].date_created).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                <div className="prose prose-invert prose-p:text-muted-foreground prose-p:text-sm prose-p:leading-relaxed">
                  <p className="text-justify font-light">
                    {formatDescription(selectedItem.data[0].description)}
                  </p>
                </div>

                <div className="mt-auto pt-8">
                  <a 
                    href={selectedItem.links?.[0]?.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full py-3 text-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
                  >
                    ABRIR ARQUIVO ORIGINAL
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
