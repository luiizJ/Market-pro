// src/app/db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless"; // <--- Mudamos de HTTP para Serverless (WebSocket)
import * as schema from "./schema";
import * as dotenv from "dotenv";
import path from "path";
import ws from "ws"; // <--- Importante para Node.js

// Carrega variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Verifique seu .env.local");
}

// Configura o WebSocket para funcionar no ambiente Node.js do Next.js
neonConfig.webSocketConstructor = ws;

// Usamos 'Pool' em vez de 'neon()'. O Pool suporta transações.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
