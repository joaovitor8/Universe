import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  try {
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: {
        api_key: apiKey,
        ...(date && { date }), 
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro na API APOD:", error);
    return NextResponse.json(
      { error: "Não foi possível acessar os arquivos estelares neste momento." },
      { status: 500 }
    );
  }
}
