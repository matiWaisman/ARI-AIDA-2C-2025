import type { Client } from 'pg';
import type { Alumno } from '../types/alumno.ts';

async function getAlumnos(
  client: Client,
  where: String,
  params: any[] = [],
  options: { single?: boolean } = {}
): Promise<Alumno | Alumno[] | undefined> {
  const query = `SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL ${where}`;
  const result = await client.query<Alumno>(query, params);

  if (options.single) {
    return result.rows[0];
  }
  return result.rows;
}

export async function getCertificadoDeAlumnoConLU(client: Client, LU: String) {
  return getAlumnos(client, "AND lu = $1", [LU], { single: true }) as Promise<Alumno>;
}

export async function getAlumnosConFechaDeseada(client: Client, fecha: String) {
  return getAlumnos(
    client,
    "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1 ORDER BY titulo_en_tramite LIMIT 1",
    [fecha],
    { single: true }
  ) as Promise<Alumno>;
}


