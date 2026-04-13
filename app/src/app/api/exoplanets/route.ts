import { NextResponse } from "next/server";
import axios from "axios";


export async function GET() {
  try {
    // Usamos ADQL (Astronomical Data Query Language) para selecionar as colunas que queremos.
    // Tabela 'ps' (Planetary Systems), default_flag=1 (parâmetros confirmados).
    const query = "select top 100 pl_name, hostname, discoverymethod, disc_year, pl_rade, pl_bmasse, pl_orbper, sy_dist from ps where default_flag=1 order by disc_year desc";
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;

    const response = await axios.get(url);

    return NextResponse.json(response.data || []);
  } catch (error) {
    console.error("Erro na API Exoplanet:", error);
    return NextResponse.json(
      { error: "Falha ao acessar os registros do espaço profundo." },
      { status: 500 }
    );
  }
}
