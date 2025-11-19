import type { Client } from "pg";
import { UserRepository } from "../../infrastructure/db/usuario-repository.ts";
import { AlumnoRepository } from "../../infrastructure/db/alumno-repository.ts";
import { EntidadUniversitariaRepository } from "../../infrastructure/db/entidadUniversitaria-repository.ts";
import { ProfesorRepository } from "../../infrastructure/db/profesor-repository.ts";
import type { Usuario } from "../entity/usuario.ts";
import { CertificadoGenerator } from "../../infrastructure/files/generador-certificados.ts";
import { MateriaRepository } from "../../infrastructure/db/materia-repository.ts";

export class Business {
    private userRepo: UserRepository;
    private entidadUniversitariaRepo: EntidadUniversitariaRepository;
    private alumnoRepo: AlumnoRepository;
    private profesorRepo: ProfesorRepository
    private materiaRepo: MateriaRepository;
    private certificadoGenerator: CertificadoGenerator;

    constructor(client: Client) {
        this.userRepo = new UserRepository(client);
        this.entidadUniversitariaRepo = new EntidadUniversitariaRepository(client);
        this.alumnoRepo = new AlumnoRepository(client);
        this.profesorRepo = new ProfesorRepository(client);
        this.materiaRepo = new MateriaRepository(client);
        this.certificadoGenerator = new CertificadoGenerator();
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

    async getAlumnos() {
        return await this.alumnoRepo.getAlumnos('', []);
    }

    async getAlumnoConLU(lu: string) {
        const alumno = await this.alumnoRepo.getAlumnoConLU(lu);
        if (!alumno) throw new Error("Alumno no encontrado");
        return alumno;
    }

    async updateAlumno(lu: string, nombres: string, apellido: string) {
        return this.alumnoRepo.updateAlumno(lu, nombres, apellido);
    }

    async deleteAlumno(lu: string) {
        const deleted = await this.alumnoRepo.deleteAlumno(lu);
        if (!deleted) throw new Error("No existe el alumno a eliminar");
        return deleted;
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

    async hashPassword(password: string) {
    return this.userRepo.hashPassword(password);
    }

    async verifyPassword(password: string, hash: string) {
    return this.userRepo.verifyPassword(password, hash);
    }

    async esAlumno(id: number | undefined): Promise<boolean> {
    return this.userRepo.esAlumno(id);
    }

    async esProfesor(id: number | undefined): Promise<boolean> {
    return this.userRepo.esProfesor(id);
    }

    async crearUsuarioSimple(username: string, password: string, nombre: string, apellido: string, lu: string, email: string) {
    return this.userRepo.crearUsuario(username, password, nombre, apellido, lu, email);
    }

    async obtenerAlumnosDeMateria(codigoMateria: string, cuatrimestre: string) {
    return this.materiaRepo.obtenerAlumnosDeMateria(codigoMateria, cuatrimestre, null);
    }

    async obtenerCompanierosDeMateria(codigoMateria: string, cuatrimestre: string, luAExcluir: string) {
    return this.materiaRepo.obtenerAlumnosDeMateria(codigoMateria, cuatrimestre, luAExcluir);
    }
}

