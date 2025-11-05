import type { Client } from "pg";
import { UserRepository } from "../../infrastructure/db/usuario-repository.ts";
import { AlumnoRepository } from "../../infrastructure/db/alumno-repository.ts";
import { EntidadUniversitariaRepository } from "../../infrastructure/db/entidadUniversitaria-repository.ts";
import { ProfesorRepository } from "../../infrastructure/db/profesor-repository.ts";
import type { Usuario } from "../entity/usuario.ts";

export class Business {
    private userRepo: UserRepository;
    private entidadUniversitariaRepo: EntidadUniversitariaRepository;
    private alumnoRepo: AlumnoRepository;
    private profesorRepo: ProfesorRepository;

    constructor(client: Client) {
        this.userRepo = new UserRepository(client);
        this.entidadUniversitariaRepo = new EntidadUniversitariaRepository(client);
        this.alumnoRepo = new AlumnoRepository(client);
        this.profesorRepo = new ProfesorRepository(client);
    }

    async crearUsuario(username: string, password: string, nombre: string, lu: string, email: string, esProfesor: boolean, esAlumno: boolean): Promise<Usuario | null> {
        const entidadUniversitaria = await this.entidadUniversitariaRepo.crearEntidadUniversitaria(lu, nombre);
        if (esProfesor) {
            await this.profesorRepo.crearProfesor(lu);
        }
        if (esAlumno) {
            await this.alumnoRepo.crearAlumno(lu);
        }
        return await this.userRepo.crearUsuario(username, password, nombre, lu, email);
    }
}
