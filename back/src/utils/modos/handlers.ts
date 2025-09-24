import type { Client } from "pg";
import { insertAlumnos } from "../database-operations.ts";
import { getCertificadoDeAlumnoConLU, getAlumnosConFechaDeseada } from "../get-alumno-necesita-certificado.ts";
import { hayAlgunAlumnoConFechaDeseada, hayAlumnoConLu } from "../existe-alumno.ts";
import { generarYGuardarCertificado } from "../generar-certificado.ts";
import type { Alumno } from "../../types/alumno.ts";

export type CommandHandler = (client: Client, arg: string) => Promise<void>;

export const modoCargaHandler: CommandHandler = async (client, filePath) => {
  console.log("Modo carga");
  console.log("Ruta:", filePath);
  await insertAlumnos(client, filePath);
};

export const modoFechaHandler: CommandHandler = async (client, fecha) => {
  console.log("Modo fecha");
  if (await hayAlgunAlumnoConFechaDeseada(client, fecha)) {
    console.log(await getAlumnosConFechaDeseada(client, fecha));
  } else {
    console.log("No hay ningun alumno que cumpla con la fecha");
  }
};

export const modoLuHandler: CommandHandler = async (client, LU) => {
  console.log("Modo LU");
  if (await hayAlumnoConLu(client, LU)) {
    const alumno: Alumno = await getCertificadoDeAlumnoConLU(client, LU);
    const rutaCertificado = await generarYGuardarCertificado(alumno);
    console.log(`Certificado generado para ${alumno.nombres} ${alumno.apellido} (LU: ${alumno.lu})`);
    console.log(`Archivo guardado en: ${rutaCertificado}`);
  } else {
    console.log("No hay ningun alumno con ese LU");
  }
};
