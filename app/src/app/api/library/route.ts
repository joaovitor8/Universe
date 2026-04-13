import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Se o usuário não digitar nada, buscamos "nebula" (nebulosas) para a página não iniciar vazia
  const query = searchParams.get("q") || "nebula"; 
  const mediaType = searchParams.get("media_type") || "image";

  try {
    const response = await axios.get("https://images-api.nasa.gov/search", {
      params: {
        q: query,
        media_type: mediaType,
      },
    });

    // A resposta oficial fica dentro de collection.items
    const items = response.data.collection?.items || [];
    
    // Retornamos os primeiros 50 resultados para manter a performance fluida
    return NextResponse.json(items.slice(0, 50));
  } catch (error) {
    console.error("Erro na API NASA Library:", error);
    return NextResponse.json(
      { error: "Falha de conexão com os arquivos centrais da NASA." },
      { status: 500 }
    );
  }
}
