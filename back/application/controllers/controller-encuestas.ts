import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { Business } from "../../domain/business/business.ts";

export class EncuestasController {
  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new Business(client);
    return { client, business };
  }

  static async obtenerEncuestasNoRespondidas(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const lu = req.session?.usuario?.id 
      ? (await business.getLuFromUserId(req.session.usuario.id)) || "" 
      : "";
    const encuestas = await business.obtenerEncuestasNoRespondidas(lu);
    res.status(200).json(encuestas);
    await client.end();
  }

  static async obtenerEncuestasSobreMiComoProfesor(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const lu = req.params.LU? req.params.LU : "";
      const encuestas = await business.obtenerEncuestasSobreMiComoProfesor(lu);
      res.status(200).json(encuestas);
      await client.end();
  }

  static async obtenerEncuestasSobreMiComoAlumno(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const lu = req.params.LU? req.params.LU : "";
    const encuestas = await business.obtenerEncuestasSobreMiComoAlumno(lu);
    res.status(200).json(encuestas);
    await client.end();
  }

  static async obtenerEncuestasDeMateriaDeCuatri(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const {codigoMateria, cuatrimestre} = req.params;
    const respuestas = 
      await business.obtenerEncuestasDeMateriaDeCuatri(codigoMateria as string, cuatrimestre as string);
    res.status(200).json(respuestas);
  }

  static async obtenerEncustasDeProfesorEnMateriaYCuatri(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const {codigoMateria, cuatrimestre} = req.params;
    const respuestas = 
      await business.obtenerEncustasDeProfesorEnMateriaYCuatri(codigoMateria as string, cuatrimestre as string);
    res.status(200).json(respuestas);
  }

  static async obtenerEncuestasDeAlumnosEnMateriaYCuatri(req: Request, res: Response) {
    const { client, business } = await EncuestasController._createDbClientAndInitializeBusiness();
    const {codigoMateria, cuatrimestre} = req.params;
    const respuestas = 
      await business.obtenerEncuestasDeAlumnosEnMateriaYCuatri(codigoMateria as string, cuatrimestre as string);
    res.status(200).json(respuestas);
  }

}
