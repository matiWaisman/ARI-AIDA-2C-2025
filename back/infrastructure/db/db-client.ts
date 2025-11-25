import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./local-sets.env" });

export function createDbClient() {
  const enProduccion = process.env.PRODUCTION_DB === "true";

  if (enProduccion) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL no está definida");
    }

    let finalConnectionString = connectionString.trim();
    if (!finalConnectionString.includes("sslmode=")) {
      const separator = finalConnectionString.includes("?") ? "&" : "?";
      finalConnectionString = `${finalConnectionString}${separator}sslmode=require`;
    }

    return new Client({
      connectionString: finalConnectionString,
    });
  }

  return new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
  });
}
