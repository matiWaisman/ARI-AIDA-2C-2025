import { Client } from "pg";
import type { Usuario } from "../../domain/entity/usuario.ts";
import bcrypt from 'bcrypt';


export class UserRepository {
  constructor(private client: Client) {}
  SALT_ROUNDS = 10;

  async existeAlumno(where: string, params: any[] = []): Promise<boolean> {
    const query = `SELECT 1 FROM aida.alumnos WHERE titulo IS NOT NULL ${where} LIMIT 1`;
    const result = await this.client.query(query, params);
    return result.rows.length > 0;
  }  

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

async autenticarUsuario(
    client: Client,
    username: string,
    password: string
): Promise<Usuario | null> {
    try {
        const result = await client.query(
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

        await client.query(
            'UPDATE aida.usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        return {
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            email: user.email,
            activo: user.activo
        };
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        return null;
    }
}

  async crearUsuario(client: Client, username: string, password: string, nombre?: string,email?: string): Promise<Usuario | null> {
    try {
        const passwordHash = await this.hashPassword(password);

        const result = await client.query(
            `INSERT INTO aida.usuarios (username, password_hash, nombre, email)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, nombre, email, activo`,
            [username, passwordHash, nombre || null, email || null]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return null;
    }
    }   

  async cambiarPassword(client: Client, userId: number, newPassword: string): Promise<boolean> {
    try {
        const passwordHash = await this.hashPassword(newPassword);

        await client.query(
            'UPDATE aida.usuarios SET password_hash = $1 WHERE id = $2',
            [passwordHash, userId]
        );

        return true;
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return false;
    }
    }

}
