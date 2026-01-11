import Fastify from "fastify" // Importação correta para TS
import cors from "@fastify/cors"
import sqlite3 from "sqlite3" // Import do driver
import "dotenv/config"
import path from "path" // Para lidar com caminhos de forma segura
import fs from "fs" // Para verificar se a pasta existe

// Import das rotas
import { RouteApod } from "./routes/apod"
import { RouteNeoWs } from "./routes/neows"
// import { RouteDonki } from "./routes/donki"
import { RouteSolarSystem } from "./routes/solar-system"
import { RouteNews } from "./routes/news"
import { RouteNewsForm } from "./routes/newsForm"

const fastify = Fastify({ logger: true })



// Configuração do Banco de Dados (Segura para Build)
// Garante que o arquivo fique na raiz do projeto ou numa pasta existente
const dbPath = path.resolve("./src/DB/", 'newsUsers.db'); 
const db = new sqlite3.Database(dbPath)

fastify.register(cors, {
  origin: "https://universe-main.vercel.app",   // "http://localhost:3000"
  methods: ["GET", "POST", "PUT", "DELETE"],
})



// Inicializa tabelas
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    news TEXT NOT NULL
  )
`, (err: any) => {
  if (err) {
    fastify.log.error('Erro ao criar tabela de usuários', err);
  } else {
    fastify.log.info(`Banco de dados iniciado em: ${dbPath}`);
  }
});



// Registro de Rotas
fastify.register(RouteApod)
fastify.register(RouteNeoWs)
// fastify.register(RouteDonki)
fastify.register(RouteSolarSystem)
fastify.register(RouteNews)
RouteNewsForm(fastify, db)



// Inicialização do Servidor
const start = async () => {
  try {
    // Render injeta a PORT como string, convertemos para Number
    const port = process.env.PORT ? Number(process.env.PORT) : 4000;
    
    // Seu Check de ambiente funciona, mas 0.0.0.0 é seguro usar sempre
    const host = '0.0.0.0'; 

    await fastify.listen({ port, host })
    console.log(`🚀 Server running on http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
