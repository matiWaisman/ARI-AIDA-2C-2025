import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.ts";
import { UsuarioBusiness } from "../../domain/business/user-business.ts";

export class UserController {

  static async authenticateUser(req: Request, res: Response) {
    const { username, password } = req.body;

    
    const client = createDbClient();
    await client.connect();

    try {
      const business = new UsuarioBusiness(client);
      const usuario = await business.autenticarUsuario(client, username, password);

      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      req.session.usuario = {
        id: usuario.id,
        username: usuario.username
      }

      res.json({ message: "Autenticación exitosa", usuario });
    } catch (error) {
      console.error("Error al autenticar usuario:", error);
      res.status(500).json({
        error: "No se pudo autenticar el usuario",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }

  static async createUser(req: Request, res: Response) {
    const { username, password } = req.body;

    
    const client = createDbClient();
    await client.connect();

    try {
      const business = new UsuarioBusiness(client);
      const nuevoUsuario = await business.crearUsuario(client, username, password);

      if (!nuevoUsuario) {
        return res.status(400).json({ error: "No se pudo crear el usuario" });
      }

      res.status(201).json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({
        error: "No se pudo crear el usuario",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }
}