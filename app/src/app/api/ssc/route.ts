import { NextResponse } from "next/server";
import axios from "axios";


export async function GET() {
  try {
    // Forçamos o cabeçalho Accept para receber JSON em vez do padrão XML
    const response = await axios.get("https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories", {
      headers: {
        "Accept": "application/json"
      }
    });

    // A API retorna uma estrutura profunda. Vamos extrair direto o array de observatórios (satélites)
    const observatories = response.data.ObservatoryResponse?.Observatory || [];

    // Formatamos para garantir que o frontend receba um array limpo
    return NextResponse.json(observatories);
    
  } catch (error) {
    console.error("Erro na API SSC:", error);
    return NextResponse.json(
      { error: "Falha de handshake com os servidores de rastreio orbital." },
      { status: 500 }
    );
  }
}
