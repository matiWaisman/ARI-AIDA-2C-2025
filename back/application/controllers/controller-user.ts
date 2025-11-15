import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.ts";
import { UsuarioBusiness } from "../../domain/business/user-business.ts";
import { Business } from "../../domain/business/business.ts";

export class UserController {
  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const userBusiness = new UsuarioBusiness(client);
    const business = new Business(client);
    return { client, business, userBusiness };
  }

  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const { client, business, userBusiness } = await UserController._createDbClientAndInitializeBusiness();
    const user = await userBusiness.autenticarUsuario(username, password);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    req.session.usuario = { id: user.id, username: user.username };
    req.session.save(() => {
    res.json({ message: "Login exitoso", usuario: req.session.usuario });
    });
    await client.end();
  }

  static async register(req: Request, res: Response) {
    const { username, password, nombre, apellido, lu, email, esProfesor, esAlumno } = req.body;
    const { client, business, userBusiness } = await UserController._createDbClientAndInitializeBusiness();
    const nuevoUsuario = await business.crearUsuario(username, password, nombre, apellido, lu, email, esProfesor, esAlumno);
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
    const REQUIRE_LOGIN = process.env.REQUIRE_LOGIN === "true" || process.env.REQUIRE_LOGIN === "1";
    
    if (req.session.usuario) {
      res.json({ 
        autenticado: true, 
        usuario: req.session.usuario,
        requireLogin: REQUIRE_LOGIN
      });
    } else {
      // Si el login es requerido y no hay sesión, retornar 401
      if (REQUIRE_LOGIN) {
        res.status(401).json({ autenticado: false, requireLogin: true });
      } else {
        res.json({ autenticado: false, requireLogin: false });
      }
    }
  }
}
