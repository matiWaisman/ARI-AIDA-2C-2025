//import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Client } from 'pg'
import { writeFileSync } from "fs";
import { insertAlumnos } from './utils/insert-alumnos.ts';
import { getPrimerAlumnoConCertificado, hayAlgunAlumnoConCertificado } from './utils/get-alumno-necesita-certificado.ts'
import dotenv from 'dotenv';
import path from 'path';
import type { Alumno } from './types/alumno.ts';
import { generarCertificadoHtml } from './utils/generar-certificado.ts';

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

if(await hayAlgunAlumnoConCertificado(clientDb)){
  console.log("Hay un alumno con certificado");
  const alumno: Alumno = (await getPrimerAlumnoConCertificado(clientDb))!; // El ! indica que nunca va a ser indefinido
  const certificadoHtml = generarCertificadoHtml(alumno);
  
  writeFileSync("certificado.html", certificadoHtml, "utf-8");
}
else {
  console.log("No hay ningun alumno al que le podamos armar un certificado");
}

await clientDb.end();