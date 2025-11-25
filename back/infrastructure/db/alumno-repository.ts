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

  async getAlumnos(where: string, params: any[] = []): Promise<Alumno[]> {
    const query = `
      SELECT * 
        FROM aida.alumnos a
        INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu`;
    const result = await this.client.query<Alumno>(query, params);
    return result.rows;
  }

  async getAlumnoConLU(lu: string): Promise<Alumno | undefined> {
    const query = `SELECT a.lu, eu.nombres, eu.apellido
      FROM aida.alumnos a
      INNER JOIN aida.entidadUniversitaria eu ON a.lu = eu.lu
      WHERE a.titulo IS NOT NULL AND a.lu = $1`;
    const result = await this.client.query(query, [lu]);
    return result.rows[0];
  }

  async getAlumnoConFechaDeseada(fecha: string): Promise<Alumno | undefined> {
    const alumnos = await this.getAlumnos(
      "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1 ORDER BY titulo_en_tramite LIMIT 1",
      [fecha]
    );
    return alumnos[0];
  }

  async crearEntidadUniversitaria(
    lu: string,
    apellido: string,
    nombres: string
  ) {
    await this.client.query(
      `
      INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
      VALUES ($1, $2, $3);
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
      const res = await this.getAlumnoConLU(lu);
      return res;
    } else {
      const queryInsertarAlumnoNuevo: string = `
        INSERT INTO aida.alumnos  
          (lu) 
        VALUES ($1)
        RETURNING *;
      `;
      const result = await this.client.query<Alumno>(queryInsertarAlumnoNuevo, [
        lu,
      ]);
      const res = result.rows[0];
      return res;
    }
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
    const queryUpdateAlumnoExistente: string = `
      UPDATE aida.alumnos
        SET apellido = $2, nombres = $3
        WHERE lu = $1
        RETURNING *;
    `;
    const result = await this.client.query<Alumno>(queryUpdateAlumnoExistente, [
      LU,
      lastName,
      name,
    ]);
    const res = result.rows[0];
    return res;
  }

  async deleteAlumno(LU: string): Promise<boolean> {
    const alumno = await this.existeAlumno("AND lu = $1", [LU]);
    if (!alumno) {
      return false;
    }
    const queryDeleteAlumno: string = `
        DELETE FROM aida.alumnos
          WHERE lu = $1;
      `;
    const result = await this.client.query(queryDeleteAlumno, [LU]);
    return result ? true : false;
  }

  async cargarAlumnosFromCSV(FilePath: string) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    await insertAlumnos(client, FilePath);
    await client.end();
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
     ) AS completo;`;
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
    const result = await this.client.query<Alumno>(
      "SELECT * FROM aida.alumnos"
    );
    const dict: AlumnosDict = {};
    for (const row of result.rows) {
      dict[row.lu] = row;
    }
    return dict;
  }

  async deleteAll(): Promise<void> {
    const result = await this.client.query("DELETE FROM aida.alumnos");
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

    const queryInsert = `
      INSERT INTO aida.alumnos (lu, apellido, nombres, titulo, titulo_en_tramite, egreso)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const queryUpdate = `
      UPDATE aida.alumnos
      SET apellido = $2, nombres = $3, titulo = $4, titulo_en_tramite = $5, egreso = $6
      WHERE lu = $1
    `;

    for (const alumno of alumnos) {
      const params = Object.values(alumno);
      if (lusExistentes.includes(alumno.lu)) {
        await this.client.query(queryUpdate, params);
      } else {
        await this.client.query(queryInsert, params);
      }
    }
  }
}
