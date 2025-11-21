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

  async materiasQueCursoAlumno(lu: string): Promise<any[]> {
    const query = `
      SELECT m.codigo_materia, m.nombre
      FROM aida.cursa c
      JOIN aida.alumno a ON c.id_alumno = a.id_alumno
      JOIN aida.materia m ON c.id_materia = m.id_materia
      JOIN aida.entidad_universitaria eu ON a.id_entidad_universitaria = eu.id_entidad_universitaria
      WHERE eu.lu = $1
    `;
    const result = await this.client.query(query, [lu]);
    return result.rows;
  }

  async ponerNotaAAlumno(codigoMateria: string, cuatrimestre: string, luAlumno: string, nota: number): Promise<void> {
    const query = `
      UPDATE aida.cursa c
      SET nota = $4
      FROM aida.alumno a
      JOIN aida.materia m ON c.id_materia = m.id_materia
      JOIN aida.entidad_universitaria eu ON a.id_entidad_universitaria = eu.id_entidad_universitaria
      WHERE eu.lu = $1
        AND m.codigo_materia = $2
        AND c.cuatrimestre = $3
    `;
    const params = [luAlumno, codigoMateria, cuatrimestre, nota];   
  }
}

