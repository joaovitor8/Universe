"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Cpu, 
  FlaskConical, 
  Loader2, 
  MapPin, 
  Microscope, 
  Milestone, 
  Rocket, 
  Settings, 
  Wrench 
} from "lucide-react";
import axios from "axios";

// Tipagem baseada na documentação do TechPort
type Project = {
  id: number;
  title: string;
  description: string;
  status: string; // Ex: "Active", "Completed"
  primaryCas?: { abbreviation: string; value: string }[];
  leadOrganization?: { name: string; city: string; state: string };
  destinations?: { description: string }[];
  workLocations?: { city: string; state: string }[];
  program?: { title: string };
  // Alguns projetos têm TRL inicial e atual (Technology Readiness Level)
  startTrl?: number;
  currentTrl?: number;
};

const fetchProjects = async (): Promise<Project[]> => {
  const res = await axios.get<Project[]>("/api/techport");
  return res.data;
};

// Componente visual para a Escala TRL (1 a 9)
const TrlBar = ({ current }: { current?: number }) => {
  const level = current || 1; // Se não houver, assumimos 1 (Pesquisa Básica)
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] font-mono text-cyan-500/70 mb-1">
        <span>TRL-1 (Conceito)</span>
        <span>TRL-9 (Voo Comprovado)</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((block) => (
          <div 
            key={block}
            className={`h-2 flex-grow transition-all duration-500 ${
              block <= level 
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                : 'bg-cyan-950/40 border border-cyan-900/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Limpa as descrições em HTML que vêm da API
const stripHtml = (html: string) => {
  if (!html) return "Descrição confidencial ou não fornecida.";
  return html.replace(/<[^>]*>?/gm, '');
};

export default function TechPortPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["techport-projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="min-h-screen text-slate-300 pt-12 pb-24 px-4 sm:px-8 relative">
      
      {/* BACKGROUND BLUEPRINT (Papel Milimetrado Técnico) */}
      <div className="absolute inset-0 pointer-events-none -z-10"
           style={{
             backgroundImage: `
               linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px),
               linear-gradient(rgba(34, 211, 238, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(34, 211, 238, 0.02) 1px, transparent 1px)
             `,
             backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
             backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
           }}
      />
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: Prancheta de Projetos */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-cyan-900/50 pb-8 mb-12"
        >
          <div className="flex items-center gap-5">
            <div className="p-4 bg-cyan-950/40 rounded-sm border border-cyan-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Cpu className="w-10 h-10 text-cyan-400 relative z-10" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold text-white tracking-tight uppercase mb-2">
                Diretório de P&D
              </h1>
              <p className="text-sm text-cyan-400/80 font-mono tracking-widest uppercase flex items-center gap-2">
                <Settings className="w-4 h-4" /> NASA Technology Portfolio System
              </p>
            </div>
          </div>

          <div className="bg-[#020617] border border-cyan-900/50 px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest text-cyan-500 shadow-inner">
            <span className="block text-slate-500 mb-1">Status do Servidor de Esquemas</span>
            <span className="text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Sincronizado (Últimos 8 Projetos)
            </span>
          </div>
        </motion.div>

        {/* LOADING & ERROR STATES */}
        {error && (
          <div className="p-12 border border-red-900/50 bg-[#020617] text-red-400 text-center font-mono rounded-sm">
            FALHA NO DOWNLOAD DOS BLUEPRINTS. AUTORIZAÇÃO NECESSÁRIA.
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Settings className="w-16 h-16 text-cyan-500 animate-spin" />
              <Wrench className="w-6 h-6 text-cyan-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="font-mono text-sm tracking-widest text-cyan-400 uppercase animate-pulse">
              Descompactando esquemas de engenharia...
            </p>
          </div>
        )}

        {/* GRID DE PROJETOS (Schematics) */}
        {!isLoading && !error && projects && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => {
              // Pegar destinos únicos (Lua, Marte, etc)
              const destinations = project.destinations 
                ? Array.from(new Set(project.destinations.map(d => d.description))) 
                : ["Genérico"];

              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={project.id}
                  className="bg-[#020617]/80 backdrop-blur-md border border-cyan-900/40 hover:border-cyan-500/60 p-8 flex flex-col group transition-colors relative"
                >
                  {/* Marcadores de "Corte" nos cantos para estilo Blueprint */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/50" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/50" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50" />

                  {/* Header do Projeto */}
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                      {project.title}
                    </h2>
                    <div className={`px-3 py-1 text-[10px] font-mono uppercase font-bold tracking-widest whitespace-nowrap border ${
                      project.status === "Active" 
                        ? "text-cyan-400 bg-cyan-950/30 border-cyan-800" 
                        : "text-emerald-400 bg-emerald-950/30 border-emerald-800"
                    }`}>
                      {project.status === "Active" ? "Em Desenvolvimento" : project.status}
                    </div>
                  </div>

                  {/* Meta-dados técnicos */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">ID do Projeto</span>
                      <span className="text-sm font-mono text-slate-300">PRJ-{project.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">Programa Central</span>
                      <span className="text-sm font-mono text-slate-300 truncate block">
                        {project.program?.title || "Independente"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3 h-3" /> Organização Líder
                      </span>
                      <span className="text-sm font-mono text-cyan-100">
                        {project.leadOrganization?.name || "NASA"} 
                        {project.leadOrganization?.state ? ` (${project.leadOrganization.state})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Escala TRL */}
                  <div className="mb-8 p-4 bg-cyan-950/10 border border-cyan-900/30 rounded-sm">
                    <span className="text-xs text-cyan-500 font-mono uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Milestone className="w-4 h-4" /> Nível de Maturidade (TRL)
                    </span>
                    <TrlBar current={project.currentTrl} />
                  </div>

                  {/* Descrição (Abstract) */}
                  <div className="flex-grow mb-8 relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-cyan-900/30" />
                    <p className="text-sm text-slate-400 leading-relaxed pl-4 font-light text-justify line-clamp-4">
                      {stripHtml(project.description)}
                    </p>
                  </div>

                  {/* Destinos da Tecnologia */}
                  <div className="mt-auto pt-4 border-t border-cyan-900/30 flex flex-wrap gap-2">
                    {destinations.map((dest, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs font-mono bg-[#020617] border border-slate-800 text-slate-400 px-3 py-1.5 rounded-full">
                        {dest.toLowerCase().includes("mars") ? <Rocket className="w-3 h-3 text-orange-500" /> : 
                         dest.toLowerCase().includes("moon") ? <div className="w-3 h-3 rounded-full bg-slate-200" /> : 
                         <FlaskConical className="w-3 h-3 text-cyan-500" />}
                        {dest}
                      </span>
                    ))}
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}