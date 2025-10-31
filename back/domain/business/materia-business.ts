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
      throw new Error();
    }
    return this.repo.crearMateria(nombreMateria, codigoMateria);
  }

  async getAllMaterias() {
    return this.repo.getAllMaterias();
  }


  async existeMateria(nombreMateria: string) {
    const materia = this.repo.getMateria(nombreMateria);
    return !!materia;
  }

}
