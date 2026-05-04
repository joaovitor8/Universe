import { NextResponse } from "next/server";
import axios from "axios";


export async function GET() {
  try {
    // 1. Buscamos a lista geral de projetos (trazendo os mais recentes)
    // A API tem o endpoint updatedSince, vamos pegar do início do ano atual para garantir dados frescos
    const currentYear = new Date().getFullYear();
    const listUrl = `https://techport.nasa.gov/api/projects?updatedSince=${currentYear}-01-01`;
    
    const listResponse = await axios.get(listUrl);
    
    // A NASA devolve a lista dentro de um objeto { projects: { projects: [...] } } (sim, duplicado)
    const projectsList = listResponse.data?.projects?.projects || listResponse.data?.projects || [];
    
    // 2. Limitamos a 8 projetos para a API não dar timeout (já que faremos chamadas em paralelo)
    const topProjects = projectsList.slice(0, 8);

    // 3. Buscamos os detalhes de cada projeto em paralelo usando Promise.all
    const detailedProjects = await Promise.all(
      topProjects.map(async (p: { id: number | string }) => {
        try {
          const detailRes = await axios.get(`https://techport.nasa.gov/api/projects/${p.id}`);
          return detailRes.data.project; // O projeto detalhado
        } catch {
          return null; // Se um falhar, não quebra tudo
        }
      })
    );

    // Filtramos possíveis nulos e devolvemos
    const validProjects = detailedProjects.filter(Boolean);

    return NextResponse.json(validProjects);
    
  } catch (error) {
    console.error("Erro na API TechPort:", error);
    return NextResponse.json(
      { error: "Falha ao acessar os esquemas técnicos do Diretório de Pesquisa." },
      { status: 500 }
    );
  }
}
