import { NextResponse } from "next/server";


// Configurações das camadas WMTS oficiais dos portais NASA Trek
const TREK_LAYERS = {
  moon: {
    name: "Lua (LRO WAC Mosaic)",
    body: "Moon",
    layer: "LRO_WAC_Mosaic_Global_303ppd_v02",
    format: "png",
    maxZoom: 5,
  },
  mars: {
    name: "Marte (Viking MDIM21)",
    body: "Mars",
    layer: "Mars_Viking_MDIM21_InvCyl_color_120m",
    format: "jpg",
    maxZoom: 5,
  },
  vesta: {
    name: "Vesta (Dawn HAMO)",
    body: "Vesta",
    layer: "Dawn_Vesta_HAMO_Mosaic_Global_DLR_60m",
    format: "jpg",
    maxZoom: 4,
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target") as keyof typeof TREK_LAYERS || "moon";

  try {
    const config = TREK_LAYERS[target] || TREK_LAYERS.moon;
    
    // Devolvemos a configuração para que o frontend construa a grelha de "tiles"
    return NextResponse.json(config);
    
  } catch (error) {
    console.error("Erro na API Trek:", error);
    return NextResponse.json(
      { error: "Falha ao calibrar os servidores cartográficos." },
      { status: 500 }
    );
  }
}
