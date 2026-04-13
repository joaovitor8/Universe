"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code2, 
  Cpu, 
  ExternalLink, 
  FileBadge, 
  Lightbulb, 
  Loader2, 
  Search 
} from "lucide-react";
import axios from "axios";

// Definimos os tipos que nossa página vai aceitar
type TechType = "patent" | "software" | "spinoff";

const fetchTechTransfer = async (type: TechType, query: string): Promise<string[][]> => {
  const res = await axios.get<string[][]>(`/api/techtransfer?type=${type}&q=${query}`);
  return res.data;
};

// Remove as tags HTML residuais da descrição
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

export default function TechTransferPage() {
  const [activeTab, setActiveTab] = useState<TechType>("software");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items, isLoading, isFetching, error } = useQuery({
    queryKey: ["techtransfer", activeTab, searchQuery],
    queryFn: () => fetchTechTransfer(activeTab, searchQuery),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  return (
    <div className="min-h-screen text-slate-300 font-sans pt-12 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background Corporativo Embaçado */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 pointer-events-none -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* HEADER: Título e Menu */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/20 mb-6 shadow-lg shadow-indigo-900/20">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Licenciamento & Inovação
          </h1>
          <p className="text-indigo-200/60 mb-8 max-w-2xl text-lg">
            Acesse o portfólio oficial de patentes, códigos-fonte abertos e tecnologias da NASA disponíveis para comercialização.
          </p>

          {/* Sistema de Abas */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("software")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "software" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Code2 className="w-4 h-4" /> Softwares Públicos
            </button>
            <button
              onClick={() => setActiveTab("patent")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "patent" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileBadge className="w-4 h-4" /> Patentes Oficiais
            </button>
            <button
              onClick={() => setActiveTab("spinoff")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "spinoff" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Lightbulb className="w-4 h-4" /> Spinoffs (Casos de Sucesso)
            </button>
          </div>

          {/* Barra de Busca */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
            <input 
              type="text" 
              placeholder="Buscar por inteligência artificial, propulsão, materiais..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-sm"
            />
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <button 
              type="submit"
              disabled={isLoading || isFetching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Consultar
            </button>
          </form>
        </motion.div>

        {/* FEEDBACK DE ESTADO */}
        {error && (
          <div className="p-8 border border-red-900/30 bg-red-950/20 text-red-400 text-center rounded-2xl max-w-2xl mx-auto">
            Não foi possível acessar os registros de propriedade intelectual no momento.
          </div>
        )}

        {(isLoading || isFetching) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-indigo-400 animate-pulse">
              Consultando o banco de dados de registro...
            </p>
          </div>
        ) : items && items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800">
            Nenhum registro encontrado para esta categoria ou termo de busca.
          </div>
        ) : (
          /* GRID DE TECNOLOGIAS */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {items?.map((item, index) => {
                // Mapeamento baseado no padrão de resposta array do TechTransfer
                const id = item[0] || `ID-${index}`;
                const code = item[1] || "N/A";
                const title = stripHtml(item[2]);
                const description = stripHtml(item[3]);
                
                // Determinando o ícone e link baseado na aba
                let Icon = Cpu;
                let linkUrl = "";

                if (activeTab === "software") {
                  Icon = Code2;
                  linkUrl = `https://software.nasa.gov/software/${code}`;
                } else if (activeTab === "patent") {
                  Icon = FileBadge;
                  linkUrl = `https://technology.nasa.gov/patent/${code}`;
                } else {
                  Icon = Lightbulb;
                  linkUrl = `https://spinoff.nasa.gov/Spinoff2020/tech_transfer.html`; // Spinoffs não têm link direto previsível na API legada
                }

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index % 12) * 0.05 }}
                    key={`${id}-${index}`}
                    className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col transition-all group hover:shadow-lg hover:shadow-indigo-900/20"
                  >
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="p-2.5 bg-slate-800/80 rounded-xl group-hover:bg-indigo-900/40 group-hover:text-indigo-400 transition-colors">
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div className="px-2.5 py-1 text-xs font-mono font-medium text-slate-500 bg-slate-950 rounded-md border border-slate-800">
                        {code}
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-100 leading-snug mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {title}
                    </h2>

                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 flex-grow mb-6 text-justify">
                      {description || "Detalhes adicionais confidenciais ou não informados na base de dados."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-800">
                      <a 
                        href={linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Ver Detalhes Oficiais <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
