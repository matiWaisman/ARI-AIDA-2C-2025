import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./local-sets.env" });

export function createDbClient() {
  const enProduccion = process.env.PRODUCTION_DB === "true";

  if (enProduccion) {
    const connectionString = process.env.CONNECTION_STRING_DB;
    if (!connectionString) {
      throw new Error(
        "No se encuentra el connection string a la base (CONNECTION_STRING_DB no está definida)"
      );
    }

    // Validar que el connection string tenga el formato correcto
    if (
      !connectionString.startsWith("postgresql://") &&
      !connectionString.startsWith("postgres://")
    ) {
      console.error(
        "Connection string inválido. Debe empezar con postgresql:// o postgres://"
      );
      console.error(
        "Connection string recibido (primeros 50 caracteres):",
        connectionString.substring(0, 50)
      );
      throw new Error(
        "Connection string inválido. Debe empezar con postgresql:// o postgres://"
      );
    }

    // Asegurar que el connection string tenga sslmode=require para Supabase
    let finalConnectionString = connectionString.trim();
    if (!finalConnectionString.includes("sslmode=")) {
      const separator = finalConnectionString.includes("?") ? "&" : "?";
      finalConnectionString = `${finalConnectionString}${separator}sslmode=require`;
    }

    console.log("Conectando a base de datos en producción...");
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
