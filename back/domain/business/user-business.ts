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

  async autenticarUsuario(
    client: Client,
    username: string,
    password: string
  ): Promise<Usuario | null> {
    return this.repo.autenticarUsuario(client, username, password);
  }

  async crearUsuario(
    client: Client,
    username: string,
    password: string,
    nombre?: string,
    email?: string
  ): Promise<Usuario | null> {
    return this.repo.crearUsuario(client, username, password, nombre, email);
  }


  // async crearUsuario(
  //   client: Client,
  //   username: string,
  //   password: string
  // ): Promise<Usuario | null> {
  //   const passwordHash = await this.hashPassword(password);

  //   try {
  //     const result = await client.query(
  //       `INSERT INTO aida.usuarios (username, password_hash, activo, ultimo_acceso)
  //        VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP)
  //        RETURNING id, username, nombre, email, activo`,
  //       [username, passwordHash]
  //     );
  //   }
  //   catch (error) {
  //     console.error('Error al crear usuario:', error);
  //     return null;
  //   }

  //   return this.repo.crearUsuario(client, username, password,);
  // }
}

