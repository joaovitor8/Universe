import { NextResponse } from "next/server";
import axios from "axios";
import type { EpicImage, ApiError } from "@/src/lib/types/nasa";

export const revalidate = 3600; // 1h

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const apiKey = process.env.KEY_NASA;

  try {
    const url = date
      ? `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${apiKey}`
      : `https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`;

    const response = await axios.get<EpicImage[]>(url);

    return NextResponse.json<EpicImage[]>(response.data ?? []);
  } catch (error) {
    console.error("Erro na API EPIC:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha ao estabelecer link de dados com o satélite DSCOVR." },
      { status: 500 },
    );
  }
}
