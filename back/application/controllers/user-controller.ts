import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.ts";
import { UsuarioBusiness } from "../../domain/business/user-business.ts";

export class UserController {
  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new UsuarioBusiness(client);
    return { client, business };
  }

  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const { client, business } = await this._createDbClientAndInitializeBusiness();
    const user = await business.autenticarUsuario(username, password);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    req.session.usuario = { id: user.id, username: user.username };
    res.json({ message: "Login exitoso", usuario: req.session.usuario });
    await client.end();
  }

  static async register(req: Request, res: Response) {
    const { username, password, nombre, email, esProfesor, esAlumno } = req.body;
    const { client, business } = await this._createDbClientAndInitializeBusiness();
    const nuevoUsuario = await business.crearUsuario(username, password, nombre, email, esProfesor, esAlumno);
    if (!nuevoUsuario) {
      return res.status(400).json({ message: "No se pudo crear el usuario" });
    }
    res.status(201).json({ message: "Usuario creado con éxito", usuario: nuevoUsuario });
    await client.end();
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy(() => {
      res.json({ message: "Sesión finalizada" });
    });
  }

  static async session(req: Request, res: Response) {
    if (req.session.usuario) {
      res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
      res.status(401).json({ autenticado: false });
    }
  }
}
