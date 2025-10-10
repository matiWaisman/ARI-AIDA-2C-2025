import { Client } from 'pg';
import dotenv from 'dotenv';
import express from "express";
import { getCertificadoDeAlumnoConLU } from './utils/get-alumno-necesita-certificado.ts';
import { alumnoToJSON } from './types/alumno.ts';

dotenv.config({ path: './local-sets.env' });

async function main() {
  const app = express();
  const port = 3001;

  app.get('/app/lu', async (req, res) => {
    console.log("Pidiendo certificado por LU:", req.query.LU);
    const clientDb = new Client({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE,
    });
    await clientDb.connect();
    try {
      const alumno = await getCertificadoDeAlumnoConLU(clientDb, req.query.LU as string);
      res.json(alumnoToJSON(alumno));
    } catch (error) {
      console.error(`Error al listar alumnos:`, error);
      res.status(500).json({ error: 'Error al listar los datos' });
    } finally {
      await clientDb.end();
    }
  });

  app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}/app/lu`);
  });
}

main().catch(console.error);
