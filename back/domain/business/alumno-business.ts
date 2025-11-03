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
    if (!alumno || !alumno.titulo_en_tramite) {
      throw new Error();
    }
    return await this.generator.generarYGuardarCertificado(alumno);
  }

  async hayCertificadosPendientes(fecha: string) {
    return await this.repo.getAlumnoConFechaDeseada(fecha);
  }

  async getAlumnoConLU(LU: string) {
    const alumno = await this.repo.getAlumnoConLU(LU);
    if (!alumno) {
      throw new Error();
    }
    return alumno;
  }

  async updateAlumno(LU: string, name: string, lastName: string) {
    return this.repo.updateAlumno(LU, name, lastName);
  }

  async insertAlumno(LU: string, name: string, lastName: string, titulo: string, titulo_en_tramite: string, egreso: string) {
    return this.repo.insertAlumno(LU, name, lastName, titulo, titulo_en_tramite, egreso);
  }

  async deleteAlumno(LU: string) {
    const deleted = this.repo.deleteAlumno(LU);
    if (deleted){
      return deleted;
    } else {
      throw new Error();
    }
  }

  async getAlumnos() {
    return this.repo.getAlumnos('', []);
  } 

  async CargarDatosEnAlumnos(FilePath: string){
    await this.repo.cargarAlumnosFromCSV(FilePath);
  }


}
