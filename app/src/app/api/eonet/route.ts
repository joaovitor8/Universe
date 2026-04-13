import { NextResponse } from "next/server";
import axios from "axios";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "30";

  try {
    const response = await axios.get("https://eonet.gsfc.nasa.gov/api/v3/events", {
      params: {
        days: days,
        status: "open",
      },
    });

    return NextResponse.json(response.data.events || []);
    
  } catch (error) {
    console.error("Erro na API EONET:", error);
    return NextResponse.json(
      { error: "Perda de sinal com a rede de satélites de observação da Terra." },
      { status: 500 }
    );
  }
}
