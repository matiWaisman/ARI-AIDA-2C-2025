import type { Client } from "pg";
import { AlumnoRepository } from "../../infrastructure/db/alumno-repository.ts";
import { CertificadoGenerator } from "../../infrastructure/files/generador-certificados.ts";

export class AlumnoBusiness {
  private repo: AlumnoRepository;
  private generator: CertificadoGenerator;

  constructor(client: Client) {
    this.repo = new AlumnoRepository(client);
    this.generator = new CertificadoGenerator();
  }

  async generarCertificadoSiAplica(LU: string) {
    const alumno = await this.repo.getAlumnoConLU(LU);
    if (!alumno) {
      throw new Error(`No se encontró alumno con LU ${LU}`);
    }

    if (!alumno.titulo_en_tramite) {
      throw new Error(`El alumno ${alumno.lu} no tiene título en trámite`);
    }

    return await this.generator.generarYGuardarCertificado(alumno);
  }

  async hayCertificadosPendientes(fecha: string) {
    return this.repo.getAlumnoConFechaDeseada(fecha);
  }

  async getAlumnoConLU(LU: string) {
    return this.repo.getAlumnoConLU(LU);
  }

  async updateAlumno(LU: string, name: string, lastName: string) {
    return this.repo.updateAlumno(LU, name, lastName);
  }

  async insertAlumno(LU: string, name: string, lastName: string) {
    return this.repo.insertAlumno(LU, name, lastName);
  }

  async deleteAlumno(LU: string) {
    return this.repo.deleteAlumno(LU);
  }

  async getAlumnos() {
    return this.repo.getAlumnos('', []);
  } 

  async CargarDatosEnAlumnos(FilePath: string){
    await this.repo.cargarAlumnosFromCSV(FilePath);
  }


}
