// application/controllers/user-controller.ts
import { createDbClient } from "../../infrastructure/db/db-client.ts";
import { UsuarioBusiness } from "../../domain/business/user-business.ts";

export class UserController {
  static async authenticateUser(username: string, password: string) {
    const client = createDbClient();
    await client.connect();

    try {
      const business = new UsuarioBusiness(client);
      const usuario = await business.autenticarUsuario(client, username, password);

      if (!usuario) return null; 
      return { id: usuario.id, username: usuario.username }; 
    } catch (error) {
      console.error("Error al autenticar usuario:", error);
      throw error;
    } finally {
      await client.end();
    }
  }

  static async createUser(username: string, password: string, nombre?: string, email?: string) {
    const client = createDbClient();
    await client.connect();

    try {
      const business = new UsuarioBusiness(client);
      const nuevoUsuario = await business.crearUsuario(client, username, password, nombre, email);
      return nuevoUsuario ?? null;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    } finally {
      await client.end();
    }
  }
}
