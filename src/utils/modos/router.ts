import type { Client } from "pg";
import { modoCargaHandler, modoFechaHandler, modoLuHandler } from "./handlers.ts";
import type { CommandHandler } from "./handlers.ts";

const commands: { regex: RegExp; handler: CommandHandler }[] = [
  { regex: /^--archivo\s+(.+)$/, handler: modoCargaHandler },
  { regex: /^--fecha\s+(\d{4}-\d{2}-\d{2})$/, handler: modoFechaHandler },
  { regex: /^--lu\s+(\S+)$/, handler: modoLuHandler },
];

export async function ejecutarModo(client: Client, input: string): Promise<void> {
  for (const cmd of commands) {
    const match = input.match(cmd.regex);
    if (match) {
      await cmd.handler(client, match[1]!);
      return;
    }
  }
  console.log("Entrada no reconocida");
}
