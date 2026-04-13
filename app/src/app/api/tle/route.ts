import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // O padrão será a ISS (NORAD 25544) se a busca estiver vazia
  const query = searchParams.get("q") || "25544";

  try {
    // A API TLE oficial/pública mais usada na comunidade (listada nos diretórios da NASA)
    const url = `https://tle.ivanstanojevic.me/api/tle/?search=${query}`;
    
    const response = await axios.get(url);
    
    // A API retorna os resultados dentro do array "member"
    const members = response.data.member || [];

    // Limitamos a 5 resultados para o terminal não ficar poluído
    return NextResponse.json(members.slice(0, 5));
    
  } catch (error) {
    console.error("Erro na API TLE:", error);
    return NextResponse.json(
      { error: "FALHA CRÍTICA: Não foi possível interceptar o sinal da base de dados orbital." },
      { status: 500 }
    );
  }
}
