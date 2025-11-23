import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './local-sets.env' });

export function createDbClient() {
  const enProduccion = process.env.PRODUCTION_DB === 'true';
  
  if (enProduccion) {
    const connectionString = process.env.CONNECTION_STRING_DB;
    if (!connectionString) {
      throw new Error('No se encuentra el connection string a la base');
    }
    return new Client({
      connectionString: connectionString,
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
