import { NextResponse } from "next/server";
import axios from "axios";
import type { NeoFeedResponse, ApiError } from "@/src/lib/types/nasa";

export const revalidate = 3600; // 1h — feed NeoWs por dia

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  if (!date) {
    return NextResponse.json<ApiError>(
      { error: "É necessário fornecer uma data de rastreio." },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get<NeoFeedResponse>(
      "https://api.nasa.gov/neo/rest/v1/feed",
      {
        params: {
          start_date: date,
          end_date: date,
          api_key: apiKey,
        },
      },
    );

    return NextResponse.json<NeoFeedResponse>(response.data);
  } catch (error) {
    console.error("Erro na API NeoWs:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha na comunicação com o radar orbital." },
      { status: 500 },
    );
  }
}
