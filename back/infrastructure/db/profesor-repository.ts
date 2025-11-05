import { Client } from "pg";
import type { Profesor } from "../../domain/entity/profesor.ts";

export class ProfesorRepository {
  constructor(private client: Client) {}

  async hayProfesorConLu(LU: string): Promise<boolean> {
    const result = await this.client.query("AND lu = $1", [LU]);
    return result.rows[0]
  }

  async getProfesorConLU(LU: string): Promise<Profesor | undefined> {
    const query = `SELECT * FROM aida.profesores WHERE lu = $1`;
    const result = await this.client.query(query, [LU]);
    return result.rows[0];
  }

  async crearProfesor(LU: string): Promise<Profesor | undefined> {
    const profesor = await this.hayProfesorConLu(LU);
      if (profesor) {
        const res = await this.getProfesorConLU(LU);
        return res;
      } else {
        const queryInsertarProfesorNuevo: string = `
          INSERT INTO aida.profesores 
            (lu) 
          VALUES ($1)
          RETURNING *;
        `;
        const result = await this.client.query<Profesor>(queryInsertarProfesorNuevo, [
          LU
        ]);
        const res = result.rows[0];
        return res;
      }
  }
}
