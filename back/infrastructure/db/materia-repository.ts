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
    const query = `SELECT * FROM aida.materias`;
    const result = await this.client.query(query);
    return result.rows;
  }
}
