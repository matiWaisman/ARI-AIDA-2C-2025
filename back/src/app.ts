import { Client } from 'pg';
import dotenv from 'dotenv';
import express from "express";
import { getCertificadoDeAlumnoConLU } from './utils/get-alumno-necesita-certificado.ts';

dotenv.config({ path: './local-sets.env' });

async function main() {
  const app = express();
  const port = 3000;

  app.get('/app/lu', async (req, res) => {
    console.log("Pidiendo datos de alumno por LU:", req.query.LU);
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
      res.setHeader('Content-Type', 'application/json');
      res.json(alumno);
    } catch (error) {
      console.error(`Error al obtener datos del alumno:`, error);
      res.status(500).json({
        error: 'No se pudo obtener los datos del alumno',
        lu: req.query.LU,
        message: error instanceof Error ? error.message : String(error)
      });
    } finally {
      await clientDb.end();
    }
  });

   app.listen(port, () => {
     console.log(`🚀 Backend corriendo en http://localhost:${port}/app/lu`);
   });
}

main().catch(console.error);
