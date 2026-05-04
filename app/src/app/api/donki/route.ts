import { NextResponse } from "next/server";
import axios from "axios";
import type { ApiError, SolarFlare } from "@/src/lib/types/nasa";

export const revalidate = 1800; // 30min — DONKI atualiza ao longo do dia

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const apiKey = process.env.KEY_NASA;

  try {
    const response = await axios.get<SolarFlare[]>(
      "https://api.nasa.gov/DONKI/FLR",
      {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          api_key: apiKey,
        },
      },
    );

    return NextResponse.json<SolarFlare[]>(response.data ?? []);
  } catch (error) {
    console.error("Erro na API DONKI:", error);
    return NextResponse.json<ApiError>(
      { error: "Interferência eletromagnética. Falha ao obter dados solares." },
      { status: 500 },
    );
  }
}
