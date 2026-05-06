import { NextResponse } from "next/server";
import axios from "axios";
import type { NewsArticle, NewsResponse } from "@/src/lib/types/news";
import type { ApiError } from "@/src/lib/types/nasa";

const BASE = "https://api.spaceflightnewsapi.net/v4/articles";

export const revalidate = 600; // 10min — feed de notícias

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");
  const newsSite = searchParams.get("source");
  const limit = Number(searchParams.get("limit") ?? "20");

  try {
    const response = await axios.get<NewsResponse>(BASE, {
      params: {
        limit,
        ordering: "-published_at",
        ...(search ? { search } : {}),
        ...(newsSite ? { news_site: newsSite } : {}),
      },
    });

    return NextResponse.json<NewsArticle[]>(response.data.results);
  } catch (error) {
    console.error("Erro na API Spaceflight News:", error);
    return NextResponse.json<ApiError>(
      { error: "Interceptação interrompida. Falha ao decodificar feed de comunicações." },
      { status: 500 },
    );
  }
}
