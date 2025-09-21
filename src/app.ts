import { Client } from 'pg';
import readline from 'readline';
import dotenv from 'dotenv';
import { ejecutarModo } from './utils/modos/router.ts';

dotenv.config({ path: './local-sets.env' });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question(
  `¿Qué modo querés usar? \n- **Modo carga**  --archivo <ruta_al_archivo_csv>\n- **Modo fecha**  --fecha <YYYY-MM-DD>\n- **Modo LU**  --lu <identificador>\n`,
  async (input) => {
    const clientDb = new Client({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE,
    });

    await clientDb.connect();
    await ejecutarModo(clientDb, input);
    rl.close();
    await clientDb.end();
  }
);
