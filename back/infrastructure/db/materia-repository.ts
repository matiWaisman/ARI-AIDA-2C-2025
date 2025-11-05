import { Client } from "pg";

export class MateriaRepository {
  constructor(private client: Client) {}

  async getMateria(where: string, params: any[] = []): Promise<boolean> {
    const query = `SELECT 1 FROM aida.materias WHERE nombreMateria = $1 LIMIT 1`; 
    const result = await this.client.query(query, params);
    return result.rows.length > 0;
  }

  async crearMateria(nombre: string, codigo: string): Promise<void> {
    const query = `
      INSERT INTO aida.materias (nombre, codigo)
      VALUES ($1, $2)
    `;
    await this.client.query(query, [nombre, codigo]);
  }
  
  async getAllMaterias(): Promise<any[]> {
    const query = `
      SELECT m.nombreMateria, m.codigoMateria, p.nombres, p.apellido, d.cuatrimestre
        FROM aida.materias m 
        INNER JOIN aida.dicta d ON m.codigoMateria = d.codigoMateria 
        INNER JOIN aida.profesor p ON d.luProfesor = p.lu`;
    const result = await this.client.query(query);
    console.log(result.rows);
    return result.rows;
  }
}
