import { Client } from 'pg';
import dotenv from 'dotenv';
import { parseCsvAndExecute } from './utils/polar/parse-csv.ts';
import express from "express";

dotenv.config({ path: 'local-sets.env' });

async function main() {
  const clientDb = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
  });

  const app = express();
  const port = 3001;


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

app.get('/v0/lu/:lu', async (req, res) => {
  debugger
  const lu = req.params.lu;

  try {
    await clientDb.connect();

    const result = await clientDb.query(
      'SELECT * FROM certificados WHERE lu = $1',
      [lu]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'LU no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al consultar LU:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await clientDb.end(); // ⚠️ Cierra la conexión (esto no es ideal si vas a hacer muchas consultas)
  }
});

  // try {
  //   await clientDb.connect();
  //   await parseCsvAndExecute(clientDb, "./in/generacion_certificados.csv");
  // } finally {
  //   await clientDb.end();
  // }
}

main().catch(console.error);
