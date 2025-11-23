import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { Business } from "../../domain/business/business.ts";

export class CursaController {
  static async _createDbClientAndInitializeBusiness() {
      const client = createDbClient();
      await client.connect();
      const business = new Business(client);
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

  static async ponerNotaAAlumno(req: Request, res: Response) { 
    const { codigoMateria, cuatrimestre, lu, nota } = req.body;
    console.log("Parametros a pasarle a la query", { codigoMateria, cuatrimestre, lu, nota });
    const { client, business }= await CursaController._createDbClientAndInitializeBusiness()
    await business.ponerNotaAAlumno(codigoMateria, cuatrimestre, lu, nota);
    res.status(200).json({ message: "Nota puesta exitosamente" });
    await client.end();
  }
}
 