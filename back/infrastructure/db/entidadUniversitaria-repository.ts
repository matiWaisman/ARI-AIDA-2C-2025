import { Client } from "pg";
import type { EntidadUniversitaria } from "../../domain/entity/entidadUniversitaria.ts";

export class EntidadUniversitariaRepository {
  constructor(private client: Client) {}

  async crearEntidadUniversitaria(lu: string, nombre: string, apellido: string|undefined): Promise<EntidadUniversitaria | undefined> {
    const query = `
      INSERT INTO aida.entidadUniversitaria (lu, apellido, nombres)
      VALUES ($1, $2, $3)
    `;
    const entidadUniversitaria = await this.client.query<EntidadUniversitaria>(query, [lu, apellido, nombre]);
    return entidadUniversitaria.rows[0];    
  }
}
