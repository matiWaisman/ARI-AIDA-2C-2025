import type { Client } from "pg";
import { AlumnoRepository } from "../../../infrastructure/db/alumno-repository.ts";
import { CertificadoGenerator } from "../../../infrastructure/files/generador-certificados.ts";
import { insertAlumnos } from "../../../infrastructure/db/database-operations.ts";
import type { Alumno } from "../../../domain/entity/alumno.ts";

export type CommandHandler = (client: Client, arg: string) => Promise<void>;

export const modoCargaHandler: CommandHandler = async (client, filePath) => {
  console.log("Modo carga");
  console.log("Ruta:", filePath);
  await insertAlumnos(client, filePath);
};

export const modoFechaHandler: CommandHandler = async (client, fecha) => {
  console.log("Modo fecha");
  const repo = new AlumnoRepository(client);

  if (await repo.hayAlumnoConFechaDeseada(fecha)) {
    const alumno = await repo.getAlumnoConFechaDeseada(fecha);
    console.log(alumno);
  } else {
    console.log("No hay ningún alumno que cumpla con la fecha");
  }
};

export const modoLuHandler: CommandHandler = async (client, LU) => {
  console.log("Modo LU");
  const repo = new AlumnoRepository(client);
  const generator = new CertificadoGenerator();

  if (await repo.hayAlumnoConLu(LU)) {
    const alumno: Alumno | undefined = await repo.getAlumnoConLU(LU);

    if (!alumno) {
      console.log("No se encontró el alumno con ese LU");
      return;
    }

    const rutaCertificado = await generator.generarYGuardarCertificado(alumno);
    console.log(`Certificado generado para ${alumno.nombres} ${alumno.apellido} (LU: ${alumno.lu})`);
    console.log(`Archivo guardado en: ${rutaCertificado}`);
  } else {
    console.log("No hay ningún alumno con ese LU");
  }
};
