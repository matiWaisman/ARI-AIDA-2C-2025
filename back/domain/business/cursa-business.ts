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
      throw new Error();
    }
    return this.repo.crearCursa(idAlumno, idMateria, cuatrimestre);
  }

  async getCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const existeCursa = await this.existeCursa(idAlumno, idMateria, cuatrimestre);
    if (existeCursa) {
      throw new Error();
    }
    return this.repo.getCursa(idAlumno, idMateria, cuatrimestre);
  }

  async existeCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const alumno = this.repo.getCursa(idAlumno, idMateria, cuatrimestre);
    return !!alumno;
  }

}
