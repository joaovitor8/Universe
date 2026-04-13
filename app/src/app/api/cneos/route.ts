import { NextResponse } from "next/server";
import axios from "axios";


export async function GET() {
  try {
    // Conectando ao sistema Sentry do Jet Propulsion Laboratory
    const response = await axios.get("https://ssd-api.jpl.nasa.gov/sentry.api");

    // A API retorna metadados na raiz e a lista de objetos no array 'data'
    const sentryData = response.data;

    return NextResponse.json({
      count: sentryData.count,
      signature: sentryData.signature,
      objects: sentryData.data || [],
    });
    
  } catch (error) {
    console.error("Erro na API CNEOS/Sentry:", error);
    return NextResponse.json(
      { error: "Falha de conexão com os servidores do Jet Propulsion Laboratory." },
      { status: 500 }
    );
  }
}
