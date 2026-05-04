import { NextResponse } from "next/server";
import axios from "axios";
import type { ExoplanetRow, ApiError } from "@/src/lib/types/nasa";

export const revalidate = 86400; // 24h — arquivo confirmado muda lentamente

export async function GET() {
  try {
    // ADQL — tabela 'ps' (Planetary Systems), default_flag=1 → linha canônica.
    const query =
      "select top 200 pl_name, hostname, discoverymethod, disc_year, pl_rade, pl_bmasse, pl_orbper, sy_dist from ps where default_flag=1 order by disc_year desc";
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(
      query,
    )}&format=json`;

    const response = await axios.get<ExoplanetRow[]>(url);

    return NextResponse.json<ExoplanetRow[]>(response.data ?? []);
  } catch (error) {
    console.error("Erro na API Exoplanet:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha ao acessar os registros do espaço profundo." },
      { status: 500 },
    );
  }
}
