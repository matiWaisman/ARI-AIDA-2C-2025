//import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Client } from 'pg'
import { insertAlumnos } from './utils/insert-alumnos.ts';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './local-sets.env' });


const clientDb = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
});

await clientDb.connect();

const fileAlumnosPath = path.join(process.cwd(), 'resources', 'alumnos.csv');

await insertAlumnos(clientDb, fileAlumnosPath);

await clientDb.end();