import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { MateriaBusiness } from "../../domain/business/materia-business.ts";
import { Business } from "../../domain/business/business.ts";

export class EncuestasController {
  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new Business(client);
    return { client, business };
  }


  static async crearEncuestaAAlumno(req: Request, res: Response) {
    const { client, business } = await this._createDbClientAndInitializeBusiness();
      const encuesta = await business.crearEncuestaAAlumno(req.body);
      res.status(201).json(encuesta);
      await client.end();
  }

  static async crearEncuestaAMateria(req: Request, res: Response) {
    const { client, business } = await this._createDbClientAndInitializeBusiness();
      const encuesta = await business.crearEncuestaAMateria(req.body);
      res.status(201).json(encuesta);
      await client.end();
  }

  static async crearEncuestaAProfesor(req: Request, res: Response) {
    const { client, business } = await this._createDbClientAndInitializeBusiness();
      const encuesta = await business.crearEncuestaAProfesor(req.body);
      res.status(201).json(encuesta);
      await client.end();
  }

  static async obtenerEncuestasSobreMiComoProfesor(req: Request, res: Response) {
    const { client, business } = await this._createDbClientAndInitializeBusiness();
    const lu = req.params.miLU? req.params.miLU : "";
      const encuestas = await business.obtenerEncuestasSobreMiComoProfesor(lu);
      res.status(200).json(encuestas);
      await client.end();
  }

  static async obtenerEncuestasSobreMiComoAlumno(req: Request, res: Response) {
    const { client, business } = await this._createDbClientAndInitializeBusiness();
    const lu = req.params.miLU? req.params.miLU : "";
    const encuestas = await business.obtenerEncuestasSobreMiComoAlumno(lu);
    res.status(200).json(encuestas);
    await client.end();
  }
}
