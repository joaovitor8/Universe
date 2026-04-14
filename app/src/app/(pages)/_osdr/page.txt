"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Dna, FlaskConical, Leaf, Loader2, Microscope, Rocket, Search, TestTube } from "lucide-react";
import axios from "axios";


// Tipagem baseada no ElasticSearch do OSDR
type OsdrStudy = {
  _id: string;
  _source: {
    Study_Title: string;
    Organism: string;
    Flight_Program?: string;
    Description: string;
    Project_Type?: string;
    Data_Types?: string;
  };
};


const fetchBioData = async (query: string): Promise<OsdrStudy[]> => {
  const res = await axios.get<OsdrStudy[]>(`/api/osdr?q=${query}`);
  return res.data;
};


// Função para escolher o ícone baseado no organismo estudado
const getOrganismIcon = (organism?: string) => {
  if (!organism) return <Dna className="w-5 h-5 text-teal-500" />;
  const orgLower = organism.toLowerCase();
  
  if (orgLower.includes("arabidopsis") || orgLower.includes("plant")) 
    return <Leaf className="w-5 h-5 text-emerald-500" />;
  if (orgLower.includes("mouse") || orgLower.includes("mus musculus") || orgLower.includes("human")) 
    return <Microscope className="w-5 h-5 text-amber-500" />;
  if (orgLower.includes("microbiome") || orgLower.includes("bacteria")) 
    return <FlaskConical className="w-5 h-5 text-cyan-500" />;
  
  return <Dna className="w-5 h-5 text-teal-500" />;
};


export default function OsdrPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("spaceflight");
  // Controla qual dossiê está aberto no momento
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: studies, isLoading, isFetching, error } = useQuery({
    queryKey: ["osdr", searchQuery],
    queryFn: () => fetchBioData(searchQuery),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setExpandedId(null); // Fecha os arquivos abertos ao pesquisar de novo
    }
  };

  const toggleDossier = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Remove as tags HTML que vêm no texto do Abstract da NASA
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="min-h-screen text-teal-50 pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background Bio-luminescente */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-teal-900/10 blur-[150px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* HEADER: Bio-Terminal */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="p-4 bg-teal-950/40 rounded-full border border-teal-800/50 mb-6 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
            <TestTube className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Laboratório Orbital
          </h1>
          <p className="text-teal-500/70 mb-8 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
            <Dna className="w-4 h-4" /> Open Science Data Repository (OSDR)
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
            <input 
              type="text" 
              placeholder="Ex: Arabidopsis, Microgravity, Mice..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#050f12] text-teal-50 border border-teal-900/50 rounded-full pl-6 pr-16 py-4 outline-none focus:border-teal-500/50 focus:bg-[#07161a] transition-all text-sm font-mono placeholder:text-teal-800"
            />
            <button 
              type="submit"
              disabled={isLoading || isFetching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-teal-900/50 hover:bg-teal-800 text-teal-400 rounded-full transition-colors disabled:opacity-50"
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>

        {/* ÁREA DE RESULTADOS (Lista de Dossiês) */}
        {error ? (
          <div className="text-center p-8 border border-red-900/30 bg-red-950/20 text-red-500 rounded-3xl font-mono">
            Contaminação de dados. Não foi possível acessar o repositório principal.
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <Dna className="w-12 h-12 text-teal-500 animate-pulse" />
            </div>
            <p className="font-mono text-sm uppercase tracking-widest text-teal-600 animate-pulse">
              Sequenciando arquivos...
            </p>
          </div>
        ) : studies && studies.length === 0 ? (
          <div className="text-center py-20 text-teal-800 font-mono">
            Nenhuma anomalia biológica ou estudo encontrado para esta pesquisa.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="pl-6 text-xs font-mono text-teal-700 uppercase tracking-widest mb-2">
              {studies?.length} Experimentos Catalogados
            </div>

            {studies?.map((study, index) => {
              const isExpanded = expandedId === study._id;
              const source = study._source;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={study._id}
                  className={`border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? "bg-[#07161a] border-teal-800/60 rounded-3xl shadow-[0_10px_40px_rgba(20,184,166,0.05)]" 
                      : "bg-[#040c0f] border-teal-950/50 rounded-2xl hover:border-teal-900 hover:bg-[#061114]"
                  }`}
                >
                  {/* Cabeçalho do Arquivo (Clicável) */}
                  <button 
                    onClick={() => toggleDossier(study._id)}
                    className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-start gap-4 grow pr-4">
                      <div className={`p-3 rounded-xl mt-1 ${isExpanded ? 'bg-teal-900/30' : 'bg-teal-950/30'}`}>
                        {getOrganismIcon(source.Organism)}
                      </div>
                      <div>
                        <h3 className={`font-serif text-lg md:text-xl font-bold leading-tight mb-2 ${isExpanded ? 'text-teal-300' : 'text-teal-50/90'}`}>
                          {source.Study_Title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-teal-600">
                          <span className="flex items-center gap-1.5 uppercase bg-teal-950/50 px-2 py-1 rounded-md border border-teal-900/30">
                            ID: {study._id.replace("OSD-", "")}
                          </span>
                          {source.Organism && (
                            <span className="flex items-center gap-1.5 capitalize text-amber-500/80">
                              {source.Organism}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 p-2 bg-teal-950/30 rounded-full text-teal-500 md:self-center self-end">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Dossiê Expandido (Abstract) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-2">
                          <div className="border-t border-teal-900/30 pt-6">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                              {source.Flight_Program && (
                                <div>
                                  <span className="block text-[10px] font-mono text-teal-700 uppercase tracking-widest mb-1">Missão / Programa</span>
                                  <span className="text-sm font-bold text-teal-400 flex items-center gap-2">
                                    <Rocket className="w-4 h-4" /> {source.Flight_Program}
                                  </span>
                                </div>
                              )}
                              {source.Data_Types && (
                                <div>
                                  <span className="block text-[10px] font-mono text-teal-700 uppercase tracking-widest mb-1">Tipo de Ensaio</span>
                                  <span className="text-sm text-teal-100">{source.Data_Types}</span>
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <span className="block text-[10px] font-mono text-teal-700 uppercase tracking-widest mb-3">Resumo da Pesquisa</span>
                              <div className="prose prose-invert prose-p:text-teal-100/80 prose-p:text-sm md:prose-p:text-base prose-p:leading-relaxed max-w-none font-light">
                                <p className="text-justify border-l-2 border-teal-800/50 pl-4">
                                  {source.Description ? stripHtml(source.Description) : "Detalhes confidenciais ou não disponibilizados neste registro."}
                                </p>
                              </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                              <a 
                                href={`https://osdr.nasa.gov/bio/repo/data/studies/${study._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors"
                              >
                                Acessar Arquivo Raw na NASA <Search className="w-3 h-3" />
                              </a>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
