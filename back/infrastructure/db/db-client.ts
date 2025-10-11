import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './local-sets.env' });

export function createDbClient() {
  return new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
  });
}
