import { NextResponse } from "next/server";
import axios from "axios";
import type { LibraryItem, ApiError } from "@/src/lib/types/nasa";

interface LibraryRawResponse {
  collection: { items: LibraryItem[] };
}

export const revalidate = 600; // 10min — caching útil para queries repetidas

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "nebula";
  const mediaType = searchParams.get("media_type") || "image";

  try {
    const response = await axios.get<LibraryRawResponse>(
      "https://images-api.nasa.gov/search",
      {
        params: { q: query, media_type: mediaType },
      },
    );

    const items = response.data.collection?.items ?? [];

    return NextResponse.json<LibraryItem[]>(items.slice(0, 60));
  } catch (error) {
    console.error("Erro na API NASA Library:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha de conexão com os arquivos centrais da NASA." },
      { status: 500 },
    );
  }
}
