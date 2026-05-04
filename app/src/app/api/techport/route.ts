import { NextResponse } from "next/server";
import axios from "axios";
import type { ApiError, TechPortProject } from "@/src/lib/types/nasa";

interface TechPortListEntry {
  id: number;
  lastUpdated?: string;
}

interface TechPortListResponse {
  projects?: { projects?: TechPortListEntry[] } | TechPortListEntry[];
}

interface TechPortDetailResponse {
  project: TechPortProject;
}

export const revalidate = 86400; // 24h — projetos R&D mudam lentamente

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const listUrl = `https://techport.nasa.gov/api/projects?updatedSince=${currentYear}-01-01`;

    const listResponse = await axios.get<TechPortListResponse>(listUrl);
    const rawList = listResponse.data?.projects;
    const projectsList: TechPortListEntry[] = Array.isArray(rawList)
      ? rawList
      : (rawList?.projects ?? []);

    // Limita a 12 para evitar timeout em paralelo
    const top = projectsList.slice(0, 12);

    const details = await Promise.all(
      top.map(async (p) => {
        try {
          const r = await axios.get<TechPortDetailResponse>(
            `https://techport.nasa.gov/api/projects/${p.id}`,
          );
          return r.data.project;
        } catch {
          return null;
        }
      }),
    );

    const valid = details.filter((p): p is TechPortProject => p !== null);

    return NextResponse.json<TechPortProject[]>(valid);
  } catch (error) {
    console.error("Erro na API TechPort:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha ao acessar os esquemas técnicos do Diretório de Pesquisa." },
      { status: 500 },
    );
  }
}
