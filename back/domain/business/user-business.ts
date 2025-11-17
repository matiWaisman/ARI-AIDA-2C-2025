import type { Client } from "pg";
import { UserRepository } from "../../infrastructure/db/usuario-repository.ts";
import type { Usuario } from "../entity/usuario.ts";

export class UsuarioBusiness {
  private repo: UserRepository;

  constructor(client: Client) {
    this.repo = new UserRepository(client);
  }

  async hashPassword(password: string) {
    return this.repo.hashPassword(password);
  }

  async verifyPassword(password: string, hash: string) {
    return this.repo.verifyPassword(password, hash);
  }

  async autenticarUsuario(username: string, password: string): Promise<Usuario | null> {
    return this.repo.autenticarUsuario(username, password);
  }

  async crearUsuario(username: string, password: string, nombre: string, apellido:string, lu: string, email: string): Promise<Usuario | null> {
    return this.repo.crearUsuario(username, password, nombre, apellido, lu, email);
  }

  async esAlumno(id: number | undefined): Promise<boolean> {
    return this.repo.esAlumno(id);
  }

  async esProfesor(id: number | undefined): Promise<boolean> {
    return this.repo.esProfesor(id);
  }


}

