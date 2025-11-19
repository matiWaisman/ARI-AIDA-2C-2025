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

    if (id === undefined) {
      return todasLasMaterias;
    }
    
    const materiasQueParticipa: Materia[] = await this.repo.getMateriasQueParticipa(id, participacion, rolEnMateria);
    
    const materiasNoParticipa: Materia[] = [];
    for (const materia of todasLasMaterias) {
      const participa = materiasQueParticipa.some(
        m => m.codigoMateria === materia.codigoMateria
      );
      if (!participa) {
        materiasNoParticipa.push(materia);
      }
    }
    console.log("Materias que no participa: ", materiasNoParticipa);
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
