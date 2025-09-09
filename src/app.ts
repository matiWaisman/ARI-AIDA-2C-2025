//import http, { IncomingMessage, ServerResponse } from 'node:http';
import { Client } from 'pg';
import readline from 'readline';
import { writeFileSync } from "fs";
import { insertAlumnos } from './utils/insert-alumnos.ts';
import { getPrimerAlumnoConCertificado, hayAlgunAlumnoConCertificado, getCertificadoDeAlumnoConLU, hayAlgunAlumnoConFechaDeseada, getAlumnosConFechaDeseada } from './utils/get-alumno-necesita-certificado.ts';
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
  // Expresiones regulares para cada caso
  const regexArchivo = /^--archivo\s+(.+)$/;
  const regexFecha   = /^--fecha\s+(\d{4}-\d{2}-\d{2})$/;
  const regexLu      = /^--lu\s+(\S+)$/;

  let match;
  await clientDb.connect(); 
  if ((match = input.match(regexArchivo))) {
    console.log("Modo carga");
    console.log("Ruta:", match[1]);
  } else if ((match = input.match(regexFecha))) {
    console.log("Modo fecha");
    if(await hayAlgunAlumnoConFechaDeseada(clientDb, match[1]!)){
      console.log("Hay alguno");
    }
    else{
      console.log("No hay ninguno");
    }
  } else if ((match = input.match(regexLu))) {
    console.log("Modo LU");
    console.log("LU:", match[1]);
  } else {
    console.log("Entrada no reconocida");
  }

  rl.close();

  await clientDb.end();
});


/*
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
*/
