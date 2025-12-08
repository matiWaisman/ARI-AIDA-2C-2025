import type { Client } from "pg";
import { UserRepository } from "../../infrastructure/db/usuario-repository.ts";
import { AlumnoRepository } from "../../infrastructure/db/alumno-repository.ts";
import { EntidadUniversitariaRepository } from "../../infrastructure/db/entidadUniversitaria-repository.ts";
import { ProfesorRepository } from "../../infrastructure/db/profesor-repository.ts";
import type { Usuario } from "../entity/usuario.ts";
import { CertificadoGenerator } from "../../infrastructure/files/generador-certificados.ts";
import { MateriaRepository } from "../../infrastructure/db/materia-repository.ts";
import { EncuestasRepository } from "../../infrastructure/db/encuestas-repository.ts";
import { CursaRepository } from "../../infrastructure/db/cursa-repository.ts";
import type { Materia } from "../entity/materia.ts";

export class Business {
    private userRepo: UserRepository;
    private entidadUniversitariaRepo: EntidadUniversitariaRepository;
    private alumnoRepo: AlumnoRepository;
    private profesorRepo: ProfesorRepository
    private materiaRepo: MateriaRepository;
    private certificadoGenerator: CertificadoGenerator;
    private encuestasRepo: EncuestasRepository;
    private cursaRepo: CursaRepository;

    constructor(client: Client) {
        this.userRepo = new UserRepository(client);
        this.entidadUniversitariaRepo = new EntidadUniversitariaRepository(client);
        this.alumnoRepo = new AlumnoRepository(client);
        this.profesorRepo = new ProfesorRepository(client);
        this.materiaRepo = new MateriaRepository(client);
        this.encuestasRepo = new EncuestasRepository(client)
        this.certificadoGenerator = new CertificadoGenerator();
        this.cursaRepo = new CursaRepository(client);
    }

    async crearUsuario({username, password, nombre, apellido, lu, email, esProfesor, esAlumno}: {
    username: string; password: string; nombre: string; apellido: string; lu: string; email: string; esProfesor: boolean; esAlumno: boolean; }): Promise<Usuario | null> {
        await this.entidadUniversitariaRepo.crearEntidadUniversitaria(lu, apellido, nombre);
        if (esProfesor) {
        await this.profesorRepo.crearProfesor(lu);
        }

        if (esAlumno) {
        await this.alumnoRepo.crearAlumno(lu);
        }

        return await this.userRepo.crearUsuario(username, password, nombre, apellido, lu, email);
    }

    async crearAlumnoCompleto({ lu, nombres, apellido, titulo, titulo_en_tramite, egreso } : { 
    lu: string; nombres: string; apellido: string; titulo: string; titulo_en_tramite: string; egreso: string;}) {
        await this.entidadUniversitariaRepo.crearEntidadUniversitaria(lu, apellido, nombres);
        return await this.alumnoRepo.crearAlumnoCompleto(lu, titulo, titulo_en_tramite, egreso);
    }

    async cargarDatosEnAlumnos(filePath: string) {
        return this.alumnoRepo.cargarAlumnosFromCSV(filePath);
    }

    //  CERTIFICADOS
    async generarCertificadoSiAplica(lu: string) {
        const alumno = await this.alumnoRepo.getAlumnoConLU(lu);

        if (!alumno || !alumno.titulo_en_tramite) {
        throw new Error(`El alumno con LU ${lu} no tiene título en trámite`);
        }

        return await this.certificadoGenerator.generarYGuardarCertificado(alumno);
    }

    async hayCertificadosPendientes(fecha: string) {
        return this.alumnoRepo.getAlumnoConFechaDeseada(fecha);
    }

    //  USUARIO 
    async autenticarUsuario(username: string, password: string) {
    return this.userRepo.autenticarUsuario(username, password);
    }

    async esAlumno(id: number | undefined): Promise<boolean> {
    return this.userRepo.esAlumno(id);
    }

    async esProfesor(id: number | undefined): Promise<boolean> {
    return this.userRepo.esProfesor(id);
    }

    async getLuFromUserId(id: number): Promise<string | null> {
    return this.userRepo.getLuFromUserId(id);
    }

    async obtenerAlumnosDeMateria(codigoMateria: string, cuatrimestre: string) {
    return this.materiaRepo.obtenerAlumnosDeMateria(codigoMateria, cuatrimestre, null);
    }

    async obtenerAlumnosDeMateriaConNota(codigoMateria: string, cuatrimestre: string) {
    return await this.materiaRepo.obtenerAlumnosDeMateriaConNota(codigoMateria, cuatrimestre);
    }

    async obtenerCompanierosDeMateria(codigoMateria: string, cuatrimestre: string, luAExcluir: string) {
    return this.materiaRepo.obtenerAlumnosDeMateria(codigoMateria, cuatrimestre, luAExcluir);
    }

    async obtenerProfesoresDeMateria(codigoMateria: string, cuatrimestre: string) {
    return this.materiaRepo.obtenerProfesoresDeMateria(codigoMateria, cuatrimestre, null);
    }

    async obtenerProfesoresDeMateriaExcluyendo(codigoMateria: string, cuatrimestre: string, luAExcluir: string) {
    return this.materiaRepo.obtenerProfesoresDeMateria(codigoMateria, cuatrimestre, luAExcluir);
    }

    async obtenerEncuestasSobreMiComoAlumno(miLU: string) {
    return this.encuestasRepo.obtenerEncuestasSobreMiComoAlumno(miLU);
    }

    async obtenerEncuestasSobreMiComoProfesor(miLU: string) {
    return this.encuestasRepo.obtenerEncuestasSobreMiComoProfesor(miLU);
    }

    async obtenerEncuestasNoRespondidas(lu: string) {
    return this.encuestasRepo.obtenerEncuestasNoRespondidas(lu);
    }

    async obtenerEncuestasDeMateriaDeCuatri(codigoMateria: string, cuatrimestre: string) {
        return this.encuestasRepo.obtenerEncuestasDeMateriaDeCuatri(codigoMateria, cuatrimestre);
    }

    async obtenerEncustasDeProfesorEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
        return this.encuestasRepo.obtenerEncuestasDeProfesorEnMateriaYCuatri(codigoMateria, cuatrimestre);
    }

    async obtenerEncuestasDeAlumnosEnMateriaYCuatri(codigoMateria: string, cuatrimestre: string) {
        return this.encuestasRepo.obtenerEncuestasDeAlumnosEnMateriaYCuatri(codigoMateria, cuatrimestre);
    }

    async ponerNotaAAlumno(codigoMateria: string, cuatrimestre: string, luAlumno: string, nota: number) {
        const result = await this.cursaRepo.ponerNotaAAlumno(codigoMateria, cuatrimestre, luAlumno, nota);
        await this.alumnoRepo.alumnoCompletoCarrera(luAlumno);
        return result
    }

    async alumnosDeProfesorPorMateriaYCuatrimestre(luProfe: string, codigoMateria: string, cuatrimestre: string){
        if(!(await this.profesorRepo.assertEsProfesorDeMateriaEnCuatrimestre(luProfe, codigoMateria, cuatrimestre))){
            throw new Error(`El ${luProfe} no pertenece a un profesor de la materia: ${codigoMateria}`);
        }
        return await this.materiaRepo.obtenerAlumnosDeMateria(codigoMateria, cuatrimestre);
    }

    async getAllMateriasQueNoParticipa(id: number | undefined, participacion: "cursa" | "dicta", rolEnMateria: "Alumno" | "Profesor") {
        const todasLasMaterias: Materia[] = await this.materiaRepo.getAllMaterias();
        
        if (id === undefined) {
            return todasLasMaterias;
        }
        
        const materiasQueParticipa: Materia[] = await this.materiaRepo.getMateriasQueParticipa(id, participacion, rolEnMateria);
        let materiasNoParticipa: Materia[] = [];
        for (let i = 0; i < todasLasMaterias.length; i++) {
            const materia = todasLasMaterias[i];

            if (!materia) {
                continue;
            }

            const participa = materiasQueParticipa.some(
            mp => mp.codigoMateria === materia.codigoMateria
            );

            if (!participa) {
                materiasNoParticipa.push(materia);
            }
        }
        return materiasNoParticipa;
    }

    async inscribirAlumnoConIdDeUsuario(codigoMateria:string, id: number|undefined) {
    return await this.materiaRepo.inscribirConId(codigoMateria, id, "cursa", "Alumno");
    }

    async inscribirProfesorConIdDeUsuario(codigoMateria:string, id: number|undefined) {
    return await this.materiaRepo.inscribirConId(codigoMateria, id, "dicta", "Profesor");
    }

    async crearCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const existeCursa = await this.existeCursa(idAlumno, idMateria, cuatrimestre);
    if (existeCursa) {
      throw new Error();
    }
    return this.cursaRepo.crearCursa(idAlumno, idMateria, cuatrimestre);
  }

  async getCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const existeCursa = await this.existeCursa(idAlumno, idMateria, cuatrimestre);
    if (existeCursa) {
      throw new Error();
    }
    return this.cursaRepo.getCursa(idAlumno, idMateria, cuatrimestre);
  }

  async existeCursa(idAlumno: number, idMateria: number, cuatrimestre: number) {
    const alumno = this.cursaRepo.getCursa(idAlumno, idMateria, cuatrimestre);
    return !!alumno;
  }

  async getAllMateriasQueParticipa(id: number, participacion: "cursa" | "dicta", rolEnMateria: "Alumno" | "Profesor") {
    return await this.materiaRepo.getMateriasQueParticipa(id, participacion, rolEnMateria);
  }
}

