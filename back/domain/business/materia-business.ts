import type { Client } from "pg";
import { AlumnoRepository } from "../../infrastructure/db/alumno-repository.ts";
import { CertificadoGenerator } from "../../infrastructure/files/generador-certificados.ts";
import { MateriaRepository } from "../../infrastructure/db/materia-repository.ts";

export class MateriaBusiness {
  private repo: MateriaRepository;
  
  constructor(client: Client) {
    this.repo = new MateriaRepository(client);
    }

  async crearMateria(nombreMateria: string, codigoMateria: string) {
    const existeMateria = await this.existeMateria(nombreMateria);
    if (existeMateria) {
      throw new Error(`La materia con nombre ${nombreMateria} ya existe.`);
    }
    return this.repo.crearMateria(nombreMateria, codigoMateria);
  }

  async existeMateria(nombreMateria: string) {
    return this.repo.existeMateria(nombreMateria);
  }

}
