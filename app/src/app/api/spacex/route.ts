import { NextResponse } from "next/server";
import axios from "axios";
import type {
  SpacexLaunch,
  SpacexLaunchpad,
  SpacexRocket,
  SpacexSnapshot,
} from "@/src/lib/types/spacex";
import type { ApiError } from "@/src/lib/types/nasa";

const BASE = "https://api.spacexdata.com/v4";

export const revalidate = 1800; // 30min — manifest de lançamentos muda raramente

export async function GET() {
  try {
    const [next, latest, upcoming, recent, rockets, launchpads] =
      await Promise.all([
        axios.get<SpacexLaunch>(`${BASE}/launches/next`).then((r) => r.data).catch(() => null),
        axios.get<SpacexLaunch>(`${BASE}/launches/latest`).then((r) => r.data).catch(() => null),
        axios
          .post<{ docs: SpacexLaunch[] }>(`${BASE}/launches/query`, {
            query: { upcoming: true },
            options: { sort: { date_unix: "asc" }, limit: 6 },
          })
          .then((r) => r.data.docs)
          .catch(() => [] as SpacexLaunch[]),
        axios
          .post<{ docs: SpacexLaunch[] }>(`${BASE}/launches/query`, {
            query: { upcoming: false },
            options: { sort: { date_unix: "desc" }, limit: 6 },
          })
          .then((r) => r.data.docs)
          .catch(() => [] as SpacexLaunch[]),
        axios.get<SpacexRocket[]>(`${BASE}/rockets`).then((r) => r.data).catch(() => [] as SpacexRocket[]),
        axios.get<SpacexLaunchpad[]>(`${BASE}/launchpads`).then((r) => r.data).catch(() => [] as SpacexLaunchpad[]),
      ]);

    const snapshot: SpacexSnapshot = {
      next,
      latest,
      upcoming,
      recent,
      rockets,
      launchpads,
    };

    return NextResponse.json<SpacexSnapshot>(snapshot);
  } catch (error) {
    console.error("Erro na API SpaceX:", error);
    return NextResponse.json<ApiError>(
      { error: "Falha ao estabelecer downlink com Hawthorne. Tente novamente." },
      { status: 500 },
    );
  }
}
