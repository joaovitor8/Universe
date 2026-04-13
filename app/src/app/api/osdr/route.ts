import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Se não houver busca, o padrão será "spaceflight" (voo espacial) para trazer experimentos reais da ISS
  const term = searchParams.get("q") || "spaceflight";

  try {
    // A API do OSDR usa um endpoint de busca (geode-py) 
    const url = "???"

    const response = await axios.get(url);

    // O ElasticSearch devolve os dados dentro de hits.hits
    const studies = response.data.hits?.hits || [];

    return NextResponse.json(studies);
  } catch (error) {
    console.error("Erro na API OSDR:", error);
    return NextResponse.json(
      { error: "Falha na decodificação da sequência de dados biológicos." },
      { status: 500 }
    );
  }
}
