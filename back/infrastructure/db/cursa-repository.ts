import { Client } from "pg";

export class CursaRepository {
  constructor(private client: Client) {}

  async crearCursa(idAlumno: number, idMateria: number, cuatrimestre: number): Promise<void> {
    const query = `
      INSERT INTO aida.cursa (id_alumno, id_materia, cuatrimestre)
      VALUES ($1, $2, $3)
    `;
    const result = await this.client.query(query, [idAlumno, idMateria, cuatrimestre]);
    return result.rows[0];
  }

  async getCursa(idAlumno: number, idMateria: number, cuatrimestre: number): Promise<boolean> {
    const query = `SELECT 1 FROM aida.cursa WHERE id_alumno = $1 AND id_materia = $2 AND cuatrimestre = $3 LIMIT 1`; 
    const result = await this.client.query(query, [idAlumno, idMateria, cuatrimestre]);
    return result.rows.length > 0;
  }
}

