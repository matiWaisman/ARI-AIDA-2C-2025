import { Client } from "pg";
import type { Profesor } from "../../domain/entity/profesor.ts";

export class ProfesorRepository {
  constructor(private client: Client) {}

  async hayProfesorConLu(LU: string): Promise<boolean> {
    const query = `SELECT 1 FROM aida.profesor WHERE lu = $1 LIMIT 1`;
    const result = await this.client.query(query, [LU]);
    return (result.rowCount ?? 0) > 0;
  }

  async getProfesorConLU(LU: string): Promise<Profesor | undefined> {
    const query = `SELECT * FROM aida.profesor WHERE lu = $1`;
    const result = await this.client.query(query, [LU]);
    return result.rows[0];
  }

async assertEsProfesorDeMateriaEnCuatrimestre(luProfe: string, codigoMateria: string, cuatrimestre: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM aida.dicta d
      WHERE d.luProfesor = $1
        AND d.codigoMateria = $2
        AND d.cuatrimestre = $3
    ) AS dicta;
  `;
  const result = await this.client.query(query, [luProfe, codigoMateria, cuatrimestre]);
  return result.rows[0].dicta === true;
}


  async crearProfesor(LU: string): Promise<Profesor | undefined> {
    const profesor = await this.hayProfesorConLu(LU);
      if (profesor) {
        const res = await this.getProfesorConLU(LU);
        return res;
      } else {
        const queryInsertarProfesorNuevo: string = `
          INSERT INTO aida.profesor 
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
