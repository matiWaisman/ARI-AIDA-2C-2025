//import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Client } from 'pg';
import readline from 'readline';
import { writeFileSync } from "fs";
import { insertAlumnos } from './utils/insert-alumnos.ts';
import { getPrimerAlumnoConCertificado, hayAlgunAlumnoConCertificado, getCertificadoDeAlumnoConLU, hayAlgunAlumnoConFechaDeseada, getAlumnosConFechaDeseada, hayAlumnoConLu } from './utils/get-alumno-necesita-certificado.ts';
import dotenv from 'dotenv';
import path from 'path';
import type { Alumno } from './types/alumno.ts';
import { generarCertificadoHtml } from './utils/generar-certificado.ts';

dotenv.config({ path: './local-sets.env' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`¿Qué modo querés usar? \n
- **Modo carga**  
  - Parámetros: --archivo <ruta_al_archivo_csv>  

- **Modo fecha**  
  - Parámetros: --fecha <YYYY-MM-DD>  

- **Modo LU**  
  - Parámetros: --lu <identificador>  
`, async (input) => {
  const clientDb = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
  });

  const regexArchivo = /^--archivo\s+(.+)$/;
  const regexFecha   = /^--fecha\s+(\d{4}-\d{2}-\d{2})$/;
  const regexLu      = /^--lu\s+(\S+)$/;

  let match;
  await clientDb.connect(); 

  if ((match = input.match(regexArchivo))) {
    console.log("Modo carga");
    console.log("Ruta:", match[1]);
    await insertAlumnos(clientDb, match[1]!);
  } else if ((match = input.match(regexFecha))) {
    console.log("Modo fecha");
    const fecha: String = match[1]!;
    if(await hayAlgunAlumnoConFechaDeseada(clientDb, fecha)){
      console.log(await getAlumnosConFechaDeseada(clientDb, fecha));
    } else {
      console.log("No hay ningun alumno que cumpla con la fecha");
    }
  } else if ((match = input.match(regexLu))) {
    console.log("Modo LU");
    const LU: String = match[1]!;
    if(await hayAlumnoConLu(clientDb, LU)){
      const alumno: Alumno = await getCertificadoDeAlumnoConLU(clientDb, LU);
      generarCertificadoHtml(alumno);
      console.log(alumno);
    } else {
      console.log("No hay ningun alumno con ese LU");
    }
  } else {
    console.log("Entrada no reconocida");
  }

  rl.close();
  await clientDb.end();
});
