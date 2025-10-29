import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { MateriaBusiness } from "../../domain/business/materia-business.ts";

export class MateriaController {
  static async crearMateria(req: Request, res: Response) {
    const { nombreMateria, codigoMateria } = req.body;

    console.log("Creando materia:", nombreMateria, codigoMateria);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new MateriaBusiness(client);
      await business.crearMateria(nombreMateria, codigoMateria);

      res.status(201).json({ message: "Materia creada exitosamente" });
    } catch (error) {
      console.error("Error al crear materia:", error);
      res.status(500).json({
        error: "No se pudo crear la materia",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }
}
