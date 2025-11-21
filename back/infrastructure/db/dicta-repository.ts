import { Client } from "pg";

export class DictaRepository {
  constructor(private client: Client) {}
  
  async materiasQueDictoProfesor(lu: string): Promise<any[]> {
    const query = `
      SELECT m.codigo_materia, m.nombre
      FROM aida.dicta d
      JOIN aida.profesor p ON d.id_profesor = p.id_profesor
      JOIN aida.materia m ON d.id_materia = m.id_materia
      JOIN aida.entidad_universitaria eu ON p.id_entidad_universitaria = eu.id_entidad_universitaria
      WHERE eu.lu = $1
    `;
    const result = await this.client.query(query, [lu]);
    return result.rows;
  }
}

