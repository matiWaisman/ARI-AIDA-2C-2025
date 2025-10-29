import { Client } from "pg";
import type { Alumno } from "../../domain/entity/alumno.ts";
import { insertAlumnos } from "./database-operations.ts";

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
    console.log("estoy en el repo", LU);
    const query = `SELECT * FROM aida.alumnos WHERE titulo IS NOT NULL AND lu = $1`;
    console.log("Query que se va a ejecutar:", query);
    const result = await this.client.query(query, [LU]);
    console.log("Filas devueltas:", result.rows.length, result.rows);
    return result.rows[0];
  }

  async getAlumnoConFechaDeseada(fecha: string): Promise<Alumno | undefined> {
    const alumnos = await this.getAlumnos(
      "AND titulo_en_tramite IS NOT NULL AND titulo_en_tramite = $1 ORDER BY titulo_en_tramite LIMIT 1",
      [fecha]
    );
    return alumnos[0];
  }

  async insertAlumno(LU: string, name: string, lastName: string): Promise<Alumno | undefined> {
      const alumno = await this.existeAlumno("AND lu = $1", [LU]);
      if (alumno) {
        const res = await this.getAlumnoConLU(LU);
        return res;
      } else {
        const queryInsertarAlumnoNuevo: string = `
          INSERT INTO aida.alumnos 
            (lu, apellido, nombres) 
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
        const result = await this.client.query<Alumno>(queryInsertarAlumnoNuevo, [LU, lastName, name]);
        const res = result.rows[0];
        return res;
      }
    }

  async updateAlumno(LU: string, name: string, lastName: string): Promise<Alumno | undefined> {
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
      const result = await this.client.query<Alumno>(queryUpdateAlumnoExistente, [LU, lastName, name]);
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
      const result =  await this.client.query(queryDeleteAlumno, [LU]);
      return result? true: false;
    }

  async cargarAlumnosFromCSV( FilePath: string){
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await insertAlumnos(client, FilePath);
    await client.end();
  };
}
