import type { Client } from "pg";
import readline from 'readline';
import { modoCargaHandler, modoFechaHandler, modoLuHandler } from "../handlers/handlers.ts";
import type { CommandHandler} from "../handlers/handlers.ts";

const commands: { regex: RegExp; handler: CommandHandler }[] = [
  { regex: /^--archivo\s+(.+)$/, handler: modoCargaHandler },
  { regex: /^--fecha\s+(\d{4}-\d{2}-\d{2})$/, handler: modoFechaHandler },
  { regex: /^--lu\s+(\S+)$/, handler: modoLuHandler },
];

export async function parseAndExecuteCommand(client: Client, input: string): Promise<void> {
  for (const cmd of commands) {
    const match = input.match(cmd.regex);
    if (match) {
      await cmd.handler(client, match[1]!);
      return;
    }
  }
  console.log("Entrada no reconocida");
}

export function getHelpMessage(): string {
  return `¿Qué modo querés usar? 
- **Modo carga**  --archivo <ruta_al_archivo_csv>
- **Modo fecha**  --fecha <YYYY-MM-DD>
- **Modo LU**  --lu <identificador>`;
}

/**
 * Función que maneja la entrada desde la terminal usando readline
 * Esta función queda guardada para uso futuro si es necesario volver a la CLI
 */
export async function handleTerminalInput(client: Client): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      getHelpMessage(),
      async (input) => {
        await parseAndExecuteCommand(client, input);
        rl.close();
        resolve();
      }
    );
  });
}
