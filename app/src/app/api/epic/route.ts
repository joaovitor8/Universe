import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  try {
    // Se tiver data, busca aquele dia. Se não, busca a coleção mais recente disponível.
    const url = date 
      ? `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${apiKey}`
      : `https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`;

    const response = await axios.get(url);

    return NextResponse.json(response.data || []);
    
  } catch (error) {
    console.error("Erro na API EPIC:", error);
    return NextResponse.json(
      { error: "Falha ao estabelecer link de dados com o satélite DSCOVR." },
      { status: 500 }
    );
  }
}
