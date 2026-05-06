import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "software"; // Pode ser: patent, software, spinoff
  const query = searchParams.get("q") || "";
  const apiKey = process.env.KEY_NASA;

  try {
    // A API do TechTransfer aceita a query string diretamente na URL antes da chave
    const url = query 
      ? `https://api.nasa.gov/techtransfer/${type}/?${query}&api_key=${apiKey}`
      : `https://api.nasa.gov/techtransfer/${type}/?api_key=${apiKey}`;

    const response = await axios.get(url);

    // Os dados vêm dentro da propriedade "results" como um array de arrays
    const results = response.data.results || [];

    // Limitamos a 24 resultados (um bom número para grids de 2, 3 ou 4 colunas)
    return NextResponse.json(results.slice(0, 24));
  } catch (error) {
    console.error("Erro na API TechTransfer:", error);
    return NextResponse.json(
      { error: "Falha de conexão com o banco de patentes da agência." },
      { status: 500 }
    );
  }
}