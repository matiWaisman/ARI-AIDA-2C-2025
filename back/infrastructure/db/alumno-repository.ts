import type { Client } from "pg";
import type { Alumno } from "../../domain/entity/alumno.ts";

export class AlumnoRepository {
  constructor(private client: Client) {}

  async existeAlumno(where: string, params: any[] = []): Promise<boolean> {
    const query = `SELECT 1 FROM aida.alumnos WHERE titulo IS NOT NULL ${where} LIMIT 1`;
    const result = await this.client.query(query, params);
    return result.rows.length > 0;
  }

  async hayAlumnoConLu(LU: string): Promise<boolean> {
    return this.existeAlumno("AND lu = $1", [LU]);
  }

  async hayAlumnoConFechaDeseada(fecha: string): Promise<boolean> {
    return this.existeAlumno(
      "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1",
      [fecha]
    );
  }

  async getAlumnos(where: string, params: any[] = []): Promise<Alumno[]> {
    const query = `SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL ${where}`;
    const result = await this.client.query<Alumno>(query, params);
    return result.rows;
  }

  async getAlumnoConLU(LU: string): Promise<Alumno | undefined> {
    const alumnos = await this.getAlumnos("AND lu = $1", [LU]);
    return alumnos[0];
  }

  async getAlumnoConFechaDeseada(fecha: string): Promise<Alumno | undefined> {
    const alumnos = await this.getAlumnos(
      "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1 ORDER BY titulo_en_tramite LIMIT 1",
      [fecha]
    );
    return alumnos[0];
  }
}
