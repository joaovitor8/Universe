import { NextResponse } from "next/server";
import axios from "axios";
import type { TleEntry, ApiError } from "@/src/lib/types/nasa";

interface TleRawResponse {
  member?: TleEntry[];
}

export const revalidate = 300; // 5min — TLE é dinâmico mas não tão rápido

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "25544";

  try {
    const url = `https://tle.ivanstanojevic.me/api/tle/?search=${encodeURIComponent(query)}`;
    const response = await axios.get<TleRawResponse>(url);

    const members = response.data.member ?? [];
    return NextResponse.json<TleEntry[]>(members.slice(0, 5));
  } catch (error) {
    console.error("Erro na API TLE:", error);
    return NextResponse.json<ApiError>(
      { error: "FALHA CRÍTICA: Não foi possível interceptar o sinal da base de dados orbital." },
      { status: 500 },
    );
  }
}
