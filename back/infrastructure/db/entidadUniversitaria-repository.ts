import { Client } from "pg";
import type { EntidadUniversitaria } from "../../domain/entity/entidadUniversitaria.ts";

export class EntidadUniversitariaRepository {
  constructor(private client: Client) {}

  async crearEntidadUniversitaria(lu: string, nombres: string, apellido: string): Promise<EntidadUniversitaria | undefined> {
    const query = `
      INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const entidadUniversitaria = await this.client.query<EntidadUniversitaria>(query, [lu, apellido, nombres]);
    return entidadUniversitaria.rows[0];    
  }
}
