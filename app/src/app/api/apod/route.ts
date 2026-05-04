import { NextResponse } from "next/server";
import axios from "axios";
import type { ApodData, ApiError } from "@/src/lib/types/nasa";

export const revalidate = 1800; // 30 min — APOD muda 1x ao dia

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  try {
    const response = await axios.get<ApodData>(
      "https://api.nasa.gov/planetary/apod",
      {
        params: {
          api_key: apiKey,
          ...(date && { date }),
        },
      },
    );

    return NextResponse.json<ApodData>(response.data);
  } catch (error) {
    console.error("Erro na API APOD:", error);
    return NextResponse.json<ApiError>(
      { error: "Não foi possível acessar os arquivos estelares neste momento." },
      { status: 500 },
    );
  }
}
