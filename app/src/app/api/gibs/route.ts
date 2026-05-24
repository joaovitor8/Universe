import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Sem data, pegamos a de ontem (para garantir que o satélite já processou a imagem global)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const defaultDate = yesterday.toISOString().split("T")[0];

  const date = searchParams.get("date") || defaultDate;
  const layer =
    searchParams.get("layer") || "MODIS_Terra_CorrectedReflectance_TrueColor";

  // URL do NASA Worldview Snapshot — BBOX global, EPSG:4326, 1920x960
  const imageUrl = `https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME=${date}&BBOX=-90,-180,90,180&CRS=EPSG:4326&LAYERS=${layer}&WRAP=day,night&FORMAT=image/jpeg&WIDTH=1920&HEIGHT=960`;

  return NextResponse.json({ imageUrl, date, layer });
}
