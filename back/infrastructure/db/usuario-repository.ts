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
        'SELECT id, username, password_hash, apellido, nombres, email, activo FROM aida.usuarios WHERE username = $1',
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

  async crearUsuario(username: string, password: string, nombres: string, apellido: string, lu:string, email: string): Promise<Usuario | null> {
    const passwordHash = await this.hashPassword(password);
    const result = await this.client.query(
        `INSERT INTO aida.usuarios (username, password_hash, apellido, nombres, lu, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username, nombres, apellido, LU, email, activo`,
        [username, passwordHash, apellido, nombres, lu, email]
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

    async esAlumno(id: number | undefined): Promise<boolean> {
        const res = await this.client.query(
            "SELECT EXISTS ( SELECT a.lu FROM aida.alumnos INNER JOIN aida.entidadUniversitaria e ON a.lu = e.lu WHERE id = $1 ) AS existe",
            [id]
        );
        return res.rows[0].existe;
    }

    async esProfesor(id: number | undefined): Promise<boolean> {
        const res = await this.client.query(
            "SELECT EXISTS ( SELECT p.lu FROM aida.profesor p INNER JOIN aida.entidadUniversitaria e ON p.lu = e.lu WHERE id = $1 ) AS existe",
            [id]
        );
        return res.rows[0].existe;
    }

}
