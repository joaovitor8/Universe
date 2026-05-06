import { NextResponse } from "next/server";
import axios from "axios";
import type { Observatory, ApiError } from "@/src/lib/types/nasa";

interface SscRawResponse {
  ObservatoryResponse?: { Observatory?: Observatory[] };
}

export const revalidate = 86400; // 24h — catálogo de satélites estável

export async function GET() {
  try {
    const response = await axios.get<SscRawResponse>(
      "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories",
      { headers: { Accept: "application/json" } },
    );

    const observatories =
      response.data.ObservatoryResponse?.Observatory ?? [];

    return NextResponse.json<Observatory[]>(observatories);
  } catch (error) {
    console.error("Erro na API SSC:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha de handshake com os servidores de rastreio orbital." },
      { status: 500 },
    );
  }
}
