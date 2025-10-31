import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { MateriaBusiness } from "../../domain/business/materia-business.ts";

export class MateriaController {
  static async _createDbClientAndInitializeBusiness() {
        const client = createDbClient();
        await client.connect();
        const business = new MateriaBusiness(client);
        return { client, business };
  }

  static async crearMateria(req: Request, res: Response) {
    const { nombreMateria, codigoMateria } = req.body;
    const { client, business }= await MateriaController._createDbClientAndInitializeBusiness()
    await business.crearMateria(nombreMateria, codigoMateria);
    res.status(200).json({ message: "Materia creada exitosamente" });
    await client.end();
  }

  static async getAllMaterias(req: Request, res: Response) {
    const { client, business } = await MateriaController._createDbClientAndInitializeBusiness()
    const materias = await business.getAllMaterias();
    res.status(200).json(materias);
    await client.end();
  }
}
