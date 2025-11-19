import type { Materia } from "../entity/materia.ts";
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
    return await this.repo.crearMateria(nombreMateria, codigoMateria);
  }

  async getAllMaterias() {
    return await this.repo.getAllMaterias();
  }

  async getAllMateriasQueNoParticipa(id: number | undefined, participacion: "cursa" | "dicta", rolEnMateria: "Alumno" | "Profesor") {
    const todasLasMaterias: Materia[] = await this.repo.getAllMaterias();
    console.log("Todas las Materias: ", todasLasMaterias)
    const materiasQueParticipa: Materia[] = await this.repo.getMateriasQueParticipa(id, participacion, rolEnMateria);
    console.log("Materias que participa: ", materiasQueParticipa);
    let materiasNoParticipa: Materia[] = [];
    for (let i = 0; i < todasLasMaterias.length; i++) {
      const materia = todasLasMaterias[i];

      const participa = materiasQueParticipa.some(
        mp => mp.codigoMateria === materia.codigoMateria
      );

      if (!participa) {
        materiasNoParticipa.push(materia);
      }
    }
  return materiasNoParticipa;
  }

  async existeMateria(nombreMateria: string) {
    const materia = await this.repo.getMateria(nombreMateria);
    return !!materia;
  }

  async inscribirAlumnoConIdDeUsuario(codigoMateria:string, id: number|undefined) {
    return await this.repo.inscribirConId(codigoMateria, id, "cursa", "Alumno");
  }

  async inscribirProfesorConIdDeUsuario(codigoMateria:string, id: number|undefined) {
    return await this.repo.inscribirConId(codigoMateria, id, "dicta", "Profesor");
  }


}
