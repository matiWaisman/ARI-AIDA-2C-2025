import type { Client } from "pg";
import { AlumnoRepository } from "../../../infrastructure/db/alumno-repository.ts";
import { CertificadoGenerator } from "../../../infrastructure/files/generador-certificados.ts";
import { insertAlumnos } from "../../../infrastructure/db/database-operations.ts";
import type { Alumno } from "../../../domain/entity/alumno.ts";

export type CommandHandler = (client: Client, arg: string) => Promise<void>;

export const modoCargaHandler: CommandHandler = async (client, filePath) => {
  const repo = new AlumnoRepository(client);
  await repo.bulkInsertOrUpdateFromCSV(filePath);
};

export const modoFechaHandler: CommandHandler = async (client, fecha) => {
  const repo = new AlumnoRepository(client);

  if (await repo.hayAlumnoConFechaDeseada(fecha)) {
    const alumno = await repo.getAlumnoConFechaDeseada(fecha);
  }
};

export const modoLuHandler: CommandHandler = async (client, LU) => {
  const repo = new AlumnoRepository(client);
  const generator = new CertificadoGenerator();

  if (await repo.hayAlumnoConLu(LU)) {
    const alumno: Alumno | undefined = await repo.getAlumnoConLU(LU);

  if (!alumno) {
    return;
  }
  const rutaCertificado = await generator.generarYGuardarCertificado(alumno);
  }
};
