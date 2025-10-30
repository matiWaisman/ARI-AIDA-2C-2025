import { Client } from "pg";
import type { Usuario } from "../../domain/entity/usuario.ts";
import bcrypt from 'bcrypt';


export class UserRepository {
  constructor(private client: Client) {}
  SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

async autenticarUsuario(username: string,password: string): Promise<Usuario | null> {
    const result = await this.client.query(
        'SELECT id, username, password_hash, nombre, email, activo FROM aida.usuarios WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    if (!user.activo) {
        return null;
    }

    const passwordValida = await this.verifyPassword(password, user.password_hash);

    if (!passwordValida) {
        return null;
    }

    return {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        activo: user.activo
    };}

  async crearUsuario(username: string, password: string, nombre?: string,email?: string, esProfesor?: boolean, esAlumno?: boolean): Promise<Usuario | null> {
    const passwordHash = await this.hashPassword(password);

    const result = await this.client.query(
        `INSERT INTO aida.usuarios (username, password_hash, nombre, email, esProfesor, esAlumno)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username, nombre, email, activo`,
        [username, passwordHash, nombre || null, email || null, esProfesor, esAlumno]
    );
    return result.rows[0];
}   

  async cambiarPassword(userId: number, newPassword: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(newPassword);
    await this.client.query(
        'UPDATE aida.usuarios SET password_hash = $1 WHERE id = $2',
        [passwordHash, userId]
    );
    return true;
    }
}
