import { NextResponse } from "next/server";
import axios from "axios";

export const revalidate = 86_400; // 1 dia — Wikipedia muda raramente para artigos canônicos

interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  content_urls?: { desktop: { page: string } };
  description?: string;
}

interface WikiResponse {
  title: string;
  extract: string;
  thumbnail: string | null;
  pageUrl: string;
  description: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const lang = searchParams.get("lang") === "en" ? "en" : "pt";

  if (!title) {
    return NextResponse.json({ error: "title é obrigatório" }, { status: 400 });
  }

  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await axios.get<WikiSummary>(url, {
      headers: { "User-Agent": "Universo/1.0 (sistema operacional do cosmos)" },
    });

    const data = res.data;
    const payload: WikiResponse = {
      title: data.title,
      extract: data.extract ?? "",
      thumbnail: data.originalimage?.source ?? data.thumbnail?.source ?? null,
      pageUrl: data.content_urls?.desktop.page ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      description: data.description ?? null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erro Wikipedia:", error);
    return NextResponse.json(
      { error: "Falha ao consultar arquivo enciclopédico." },
      { status: 502 },
    );
  }
}
