import { Client } from "pg";
import type { Alumno, AlumnosDict } from "../../domain/entity/alumno.ts";
import { insertAlumnos } from "./database-operations.ts";
import { readCsv } from "../files/read-csv.ts";

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

  async getAlumnos(where: string = "", params: any[] = []): Promise<Alumno[]> {
    const query = `
      SELECT a.lu, a.titulo, a.titulo_en_tramite, a.egreso,
             eu.apellido, eu.nombres
      FROM aida.alumnos a
      INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu
      WHERE 1 = 1
      ${where}
    `;

    const result = await this.client.query<Alumno>(query, params);
    return result.rows;
  }

  async getAlumnoConLU(lu: string): Promise<Alumno | undefined> {
    const query = `
      SELECT a.lu, a.titulo, a.titulo_en_tramite, a.egreso,
             eu.apellido, eu.nombres
      FROM aida.alumnos a
      INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu
      WHERE a.titulo IS NOT NULL AND a.lu = $1
    `;
    const result = await this.client.query(query, [lu]);
    return result.rows[0];
  }

async getAlumnoConFechaDeseada(fecha: string): Promise<Alumno | undefined> {
  const sql = `
    SELECT *
    FROM aida.alumnos a
    INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu
    WHERE a.titulo_en_tramite::date = $1::date
    LIMIT 1
  `;
  const result = await this.client.query(sql, [fecha]);
  return result.rows[0];
}


  async crearEntidadUniversitaria(
    lu: string,
    apellido: string,
    nombres: string
  ) {
    await this.client.query(
      `
        INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
        VALUES ($1, $2, $3)
        ON CONFLICT (lu)
        DO UPDATE SET apellido = EXCLUDED.apellido,
                      nombres = EXCLUDED.nombres;
      `,
      [lu, apellido, nombres]
    );
  }

  async crearAlumnoCompleto(
    lu: string,
    titulo: string,
    titulo_en_tramite: string,
    egreso: string
  ) {
    const result = await this.client.query(
      `
        INSERT INTO aida.alumnos (lu, titulo, titulo_en_tramite, egreso)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [lu, titulo, titulo_en_tramite, egreso]
    );

    return result.rows[0];
  }

  async crearAlumno(lu: string): Promise<Alumno | undefined> {
    const existeAlumno = await this.hayAlumnoConLu(lu);
    if (existeAlumno) {
      return this.getAlumnoConLU(lu);
    }

    const queryInsertarAlumnoNuevo = `
      INSERT INTO aida.alumnos (lu)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await this.client.query<Alumno>(queryInsertarAlumnoNuevo, [
      lu,
    ]);
    return result.rows[0];
  }

  async updateAlumno(
    LU: string,
    name: string,
    lastName: string
  ): Promise<Alumno | undefined> {
    const alumno = await this.existeAlumno("AND lu = $1", [LU]);
    if (!alumno) {
      return undefined;
    }

    // Se actualiza entidadUniversitaria, NO alumnos
    const queryUpdateEntidad = `
      UPDATE aida.entidadUniversitaria
      SET apellido = $2, nombres = $3
      WHERE lu = $1
      RETURNING *;
    `;
    const result = await this.client.query(queryUpdateEntidad, [
      LU,
      lastName,
      name,
    ]);

    return result.rows[0];
  }

  async deleteAlumno(LU: string): Promise<boolean> {
    const alumno = await this.existeAlumno("AND lu = $1", [LU]);
    if (!alumno) return false;

    const queryDeleteAlumno = `
      DELETE FROM aida.alumnos
      WHERE lu = $1;
    `;
    await this.client.query(queryDeleteAlumno, [LU]);

    // No borramos entidadUniversitaria por si lo usan en otras tablas
    return true;
  }

  async cargarAlumnosFromCSV(filePath: string) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await insertAlumnos(client, filePath);
    await client.end();
  }

  async cargarDatosEnAlumnos(filePath: string) {
    return this.cargarAlumnosFromCSV(filePath);
  }

  async alumnoCompletoCarrera(LU: string) {
    const query1 = `
      SELECT NOT EXISTS (
          SELECT 1
          FROM aida.materias m
          WHERE NOT EXISTS (
              SELECT 1
              FROM aida.cursa c
              WHERE c.luAlumno = $1
                AND c.codigoMateria = m.codigoMateria
                AND c.nota > 4
          )
      ) AS completo;
    `;
    const result = await this.client.query(query1, [LU]);

    if (!result.rows[0]) {
      throw new Error("La consulta no devolvió ninguna fila");
    }

    if (result.rows[0].completo) {
      const query2 = `
        UPDATE aida.alumnos
        SET titulo_en_tramite = CURRENT_DATE
        WHERE lu = $1;
      `;
      await this.client.query(query2, [LU]);
    }

    return result.rows[0].completo;
  }

  async getAllAsDict(): Promise<AlumnosDict> {
    const query = `
      SELECT a.lu, a.titulo, a.titulo_en_tramite, a.egreso,
             eu.apellido, eu.nombres
      FROM aida.alumnos a
      INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu
    `;

    const result = await this.client.query<Alumno>(query);
    const dict: AlumnosDict = {};

    for (const row of result.rows) {
      dict[row.lu] = row;
    }

    return dict;
  }

  async deleteAll(): Promise<void> {
    await this.client.query("DELETE FROM aida.alumnos");
  }

  async bulkInsertOrUpdateFromCSV(filePath: string): Promise<void> {
    const alumnos = await readCsv(filePath);
    const listaDeLus = alumnos.map((a) => a.lu);

    const queryFiltrarExistentes = `SELECT lu FROM aida.alumnos WHERE lu = ANY($1)`;
    const existentes = await this.client.query<{ lu: string }>(
      queryFiltrarExistentes,
      [listaDeLus]
    );
    const lusExistentes = existentes.rows.map((a) => a.lu);

    // CORREGIDO: los datos personales van a entidadUniversitaria
    const queryUpsertEntidad = `
      INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
      VALUES ($1, $2, $3)
      ON CONFLICT (lu)
      DO UPDATE SET apellido = EXCLUDED.apellido,
                    nombres = EXCLUDED.nombres;
    `;

    const queryInsertAlumno = `
      INSERT INTO aida.alumnos (lu, titulo, titulo_en_tramite, egreso)
      VALUES ($1, $4, $5, $6)
    `;

    const queryUpdateAlumno = `
      UPDATE aida.alumnos
      SET titulo = $4, titulo_en_tramite = $5, egreso = $6
      WHERE lu = $1
    `;

    for (const alumno of alumnos) {
      // apellido y nombres → entidadUniversitaria
      await this.client.query(queryUpsertEntidad, [
        alumno.lu,
        alumno.apellido,
        alumno.nombres
      ]);

      if (lusExistentes.includes(alumno.lu)) {
        await this.client.query(queryUpdateAlumno, [
          alumno.lu,
          alumno.apellido,
          alumno.nombres,
          alumno.titulo,
          alumno.titulo_en_tramite,
          alumno.egreso,
        ]);
      } else {
        await this.client.query(queryInsertAlumno, [
          alumno.lu,
          alumno.apellido,
          alumno.nombres,
          alumno.titulo,
          alumno.titulo_en_tramite,
          alumno.egreso,
        ]);
      }
    }
  }
}
