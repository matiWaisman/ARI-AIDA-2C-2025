import { Client } from 'pg';
import dotenv from 'dotenv';
import { parseCsvAndExecute } from './utils/polar/parse-csv.ts';

dotenv.config({ path: './local-sets.env' });

async function main() {
  const clientDb = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
  });

  try {
    await clientDb.connect();
    await parseCsvAndExecute(clientDb, "./in/generacion_certificados.csv");
  } finally {
    await clientDb.end();
  }
}

main().catch(console.error);
