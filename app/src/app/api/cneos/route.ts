import { NextResponse } from "next/server";
import axios from "axios";
import type {
  SentryObject,
  SentryResponse,
  ApiError,
} from "@/src/lib/types/nasa";

interface RawSentryResponse {
  count: string;
  signature: { source: string; version: string };
  data: SentryObject[];
}

export const revalidate = 21600; // 6h — Sentry recalcula trajetórias raramente

export async function GET() {
  try {
    const response = await axios.get<RawSentryResponse>(
      "https://ssd-api.jpl.nasa.gov/sentry.api",
    );

    const sentry = response.data;

    return NextResponse.json<SentryResponse>({
      count: sentry.count,
      signature: sentry.signature,
      objects: sentry.data ?? [],
    });
  } catch (error) {
    console.error("Erro na API CNEOS/Sentry:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha de conexão com os servidores do Jet Propulsion Laboratory." },
      { status: 500 },
    );
  }
}
