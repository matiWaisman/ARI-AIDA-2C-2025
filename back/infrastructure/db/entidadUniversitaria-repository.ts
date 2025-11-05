import { Client } from "pg";
import type { EntidadUniversitaria } from "../../domain/entity/entidadUniversitaria.ts";

export class EntidadUniversitariaRepository {
  constructor(private client: Client) {}

  async crearEntidadUniversitaria(lu: string, nombre: string): Promise<EntidadUniversitaria | undefined> {
    const query = `
      INSERT INTO aida.entidades_universitarias (lu, nombre)
      VALUES ($1, $2)
    `;
    const entidadUniversitaria = await this.client.query<EntidadUniversitaria>(query, [lu]);
    return entidadUniversitaria.rows[0];    
  }
}
