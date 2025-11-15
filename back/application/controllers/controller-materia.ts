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
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    await business.crearMateria(nombreMateria, codigoMateria);
    res.status(200).json({ message: "Materia creada exitosamente" });
    await client.end();
  }

  static async getAllMateriasConProfesorYCuatri(req: Request, res: Response) {
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    const materias = await business.getAllMaterias();
    res.status(200).json(materias);
    await client.end();
  }

  static async inscribirACursar(req: Request, res: Response){
    const codigoMateria = req.query.codigoMateria as string; 
    const id = req.session.usuario?.id;
    console.log("ID de usuario: ", id);
    const {client, business} = await MateriaController._createDbClientAndInitializeBusiness()
    const alumno = await business.inscribirAlumnoConIdDeUsuario(codigoMateria, id)
  }

  static async inscribirADictar(req: Request, res: Response){
    const codigoMateria = req.query.codigoMateria as string; 
    const id = req.session.usuario?.id
    const {client, business} = await MateriaController._createDbClientAndInitializeBusiness();
    const alumno = await business.inscribirProfesorConIdDeUsuario(codigoMateria, id);
  }
}
