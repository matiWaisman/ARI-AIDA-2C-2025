import type { Client } from "pg";
import fs from "fs";
import readline from "readline";
import { modoCargaHandler, modoFechaHandler, modoLuHandler, type CommandHandler } from "../modos/handlers.ts";

/**
 * Mapea el tipo de comando en el CSV a su handler correspondiente
 */
const csvCommandMap: Record<string, CommandHandler> = {
  archivo: modoCargaHandler,
  fecha: modoFechaHandler,
  lu: modoLuHandler,
};

/**
 * Función principal que lee un CSV con columnas tipo,parametro
 * y ejecuta los handlers correspondientes.
 */
export async function parseCsvAndExecute(client: Client, csvPath: string): Promise<void> {
  if (!fs.existsSync(csvPath)) {
    console.error(`Archivo no encontrado: ${csvPath}`);
    return;
  }

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue; // ignorar líneas vacías o comentarios

    const [tipo, parametro] = trimmed.split(",").map(s => s.trim());
    if (!tipo || !parametro) {
      console.warn(`Línea inválida en CSV: ${line}`);
      continue;
    }

    const handler = csvCommandMap[tipo.toLowerCase()];
    if (!handler) {
      console.warn(`Tipo de comando desconocido: ${tipo}`);
      continue;
    }

    console.log(`Ejecutando comando CSV: ${tipo} -> ${parametro}`);
    await handler(client, parametro);
  }
}
