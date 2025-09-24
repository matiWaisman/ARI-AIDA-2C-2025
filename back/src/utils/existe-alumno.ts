import type { Client } from "pg";
import type { Alumno } from "../types/alumno.ts";


async function existeAlumno(
  client: Client,
  where: String,
  params: any[] = []
): Promise<boolean> {
  const query = `SELECT 1 FROM aida.alumnos WHERE titulo IS NOT NULL ${where} LIMIT 1`;
  const result = await client.query(query, params);
  return result.rows.length > 0;
}

export async function hayAlumnoConLu(client: Client, LU: String) {
  return existeAlumno(client, "AND lu = $1", [LU]);
}

export async function hayAlgunAlumnoConFechaDeseada(client: Client, fecha: String) {
  return existeAlumno(client, "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1", [fecha]);
}
