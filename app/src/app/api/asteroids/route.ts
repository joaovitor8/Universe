import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  if (!date) {
    return NextResponse.json(
      { error: "É necessário fornecer uma data de rastreio." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
      params: {
        start_date: date,
        end_date: date,
        api_key: apiKey,
      },
    });

    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error("Erro na API NeoWs:", error);
    return NextResponse.json(
      { error: "Falha na comunicação com o radar orbital." },
      { status: 500 }
    );
  }
}
