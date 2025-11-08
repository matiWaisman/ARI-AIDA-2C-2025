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
      throw new Error(`El alumno con LU: ${LU} no esta recibido`);
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

  async crearAlumno(LU: string) {
    const existeAlumno = await this.repo.getAlumnoConLU(LU);
    if (existeAlumno) {
      throw new Error();
    }
    return this.repo.crearAlumno(LU);
  }

  async updateAlumno(LU: string, name: string, lastName: string) {
    return this.repo.updateAlumno(LU, name, lastName);
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
