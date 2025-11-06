import { Client } from "pg";
import type { EntidadUniversitaria } from "../../domain/entity/entidadUniversitaria.ts";

export class EntidadUniversitariaRepository {
  constructor(private client: Client) {}

  async crearEntidadUniversitaria(lu: string, nombres: string): Promise<EntidadUniversitaria | undefined> {
    const query = `
      INSERT INTO aida.entidadUniversitaria (lu, nombres)
      VALUES ($1, $2)
    `;
    const entidadUniversitaria = await this.client.query<EntidadUniversitaria>(query, [lu, nombres]);
    return entidadUniversitaria.rows[0];    
  }
}
