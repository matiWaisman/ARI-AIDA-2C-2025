import type { Client } from "pg";
import { CursaRepository } from "../../infrastructure/db/cursa-repository.ts";

export class CursaBusiness {
  private repo: CursaRepository;
  
  constructor(client: Client) {
    this.repo = new CursaRepository(client);
    }

  async crearCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const existeCursa = await this.existeCursa(idAlumno, idMateria, cuatrimestre);
    if (existeCursa) {
      throw new Error(`La cursada para el alumno ${idAlumno} en la materia ${idMateria} durante el cuatrimestre ${cuatrimestre} ya existe.`);
    }
    return this.repo.crearCursa(idAlumno, idMateria, cuatrimestre);
  }

  async existeCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    return this.repo.existeCursa(idAlumno, idMateria, cuatrimestre);
  }

}
