import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { CursaBusiness } from "../../domain/business/cursa-business.ts";

export class CursaController {
  static async _createDbClientAndInitializeBusiness() {
      const client = createDbClient();
      await client.connect();
      const business = new CursaBusiness(client);
      return { client, business };
    }

  static async crearCursa(req: Request, res: Response) {
    const { idAlumno, idMateria, cuatrimestre } = req.body;
    const { client, business }= await CursaController._createDbClientAndInitializeBusiness()
    await business.crearCursa(idAlumno, idMateria, cuatrimestre);
    res.status(200).json({ message: "Cursada creada exitosamente" });
    await client.end();
  }

  static async getCursa(req: Request, res: Response) {
    const { idAlumno, idMateria, cuatrimestre } = req.body;
    const { client, business }= await CursaController._createDbClientAndInitializeBusiness()
    await business.getCursa(idAlumno, idMateria, cuatrimestre);
    res.status(200).json({ message: "Cursada obtenida exitosamente" });
    await client.end();
  }

  static async getMaterias(req: Request, res: Response) {
    const { idAlumno, idMateria, cuatrimestre } = req.body;
    const { client, business }= await CursaController._createDbClientAndInitializeBusiness()
    await business.getCursa(idAlumno, idMateria, cuatrimestre);
    res.status(200).json({ message: "Cursada obtenida exitosamente" });
    await client.end();
  }
}
 