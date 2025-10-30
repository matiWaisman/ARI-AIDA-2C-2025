import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { MateriaBusiness } from "../../domain/business/materia-business.ts";

export class MateriaController {
  static async crearMateria(req: Request, res: Response) {
    const { nombreMateria, codigoMateria } = req.body;
    const client = createDbClient();
    await client.connect();
    const business = new MateriaBusiness(client);
    await business.crearMateria(nombreMateria, codigoMateria);

    res.status(201).json({ message: "Materia creada exitosamente" });
    await client.end();
  }
}
