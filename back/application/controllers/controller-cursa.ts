import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { CursaBusiness } from "../../domain/business/cursa-business.ts";

export class CursaController {
  static async crearCursa(req: Request, res: Response) {
    const { idAlumno, idMateria, cuatrimestre } = req.body;

    console.log("Creando cursada:", idAlumno, idMateria, cuatrimestre);
    const client = createDbClient();
    await client.connect();
    const business = new CursaBusiness(client);
    await business.crearCursa(idAlumno, idMateria, cuatrimestre);
    res.status(201).json({ message: "Cursada creada exitosamente" });
    await client.end();
  }
}
 