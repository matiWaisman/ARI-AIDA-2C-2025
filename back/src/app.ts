import { Client } from 'pg';
import dotenv from 'dotenv';
import express from "express";
import { getCertificadoDeAlumnoConLU } from './utils/get-alumno-necesita-certificado.ts';
import { generarCertificadoHtml } from './utils/generar-certificado.ts';

dotenv.config({ path: './local-sets.env' });

async function main() {
  const app = express();
  const port = 3000;

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
      const certificadoHtml = await generarCertificadoHtml(alumno);
      res.setHeader('Content-Type', 'text/html');
      res.send(certificadoHtml);
    } catch (error) {
      console.error(`Error al generar certificado:`, error);
      res.status(500).send(`
        <html>
          <body>
            <h1>Error</h1>
            <p>No se pudo generar el certificado para el LU: ${req.query.LU}</p>
            <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
          </body>
        </html>
      `);
    } finally {
      await clientDb.end();
    }
  });

   app.listen(port, () => {
     console.log(`🚀 Backend corriendo en http://localhost:${port}/app/lu`);
   });
}

main().catch(console.error);
