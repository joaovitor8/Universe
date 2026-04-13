import { NextResponse } from "next/server";
import axios from "axios";


export async function GET() {
  const apiKey = process.env.KEY_NASA;

  try {
    // A API do InSight usa a versão 1.0 e feedtype json
    const response = await axios.get("https://api.nasa.gov/insight_weather/", {
      params: {
        api_key: apiKey,
        feedtype: "json",
        ver: "1.0"
      }
    });

    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error("Erro na API InSight Mars:", error);
    return NextResponse.json(
      { error: "Sinal perdido. A tempestade de areia bloqueou a transmissão do lander." },
      { status: 500 }
    );
  }
}
