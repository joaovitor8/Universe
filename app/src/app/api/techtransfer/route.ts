import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 86400; // 24h — patentes/spin-offs mudam lentamente

interface TechTransferResponse {
  results?: unknown[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "software"; // patent | software | spinoff
  const query = searchParams.get("q") || "";

  return handleRoute(
    {
      tag: "TECHTRANSFER",
      fallbackMessage: "Falha de conexão com o banco de patentes da agência.",
      messages: {
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    async () => {
      // A API espera os filtros como query string crua antes do api_key.
      const path = query
        ? `https://api.nasa.gov/techtransfer/${type}/?${query}`
        : `https://api.nasa.gov/techtransfer/${type}/`;

      const data = await fetchUpstream<TechTransferResponse>(path, {
        nasaAuth: true,
      });

      return (data.results ?? []).slice(0, 24);
    },
  );
}
