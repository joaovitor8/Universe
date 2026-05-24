import type { EpicImage } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 3600; // 1h

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  const url = date
    ? `https://api.nasa.gov/EPIC/api/natural/date/${date}`
    : "https://api.nasa.gov/EPIC/api/natural";

  return handleRoute(
    {
      tag: "EPIC",
      fallbackMessage:
        "Falha ao estabelecer link de dados com o satélite DSCOVR.",
      messages: {
        404: "Sem imagens disponíveis para a data selecionada.",
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    async () => {
      const data = await fetchUpstream<EpicImage[]>(url, { nasaAuth: true });
      return data ?? [];
    },
  );
}
