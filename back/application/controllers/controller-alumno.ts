import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { Business } from "../../domain/business/business.ts";
import fs from "fs";
import path from "path";

export class AlumnoController {

  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new Business(client);
    return { client, business };
  }

  static async generarCertificado(req: Request, res: Response) {
    const LU = req.query.lu as string;
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const ruta = await business.generarCertificadoSiAplica(LU);
    res.json({ message: "Certificado generado", path: ruta });
    await client.end();
  }

  static async getAlumnosDeProfesorPorMateriaYCuatrimestre(req: Request, res: Response){
    const {luProfe, codigoMateria, cuatrimestre} = req.body;
    if(!luProfe || !codigoMateria || !cuatrimestre){
      return res.status(400).json({ error: "luProfesor, codigoMateria y cuatrimestre son obligatorios." });
    }
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const resultado = await business.alumnosDeProfesorPorMateriaYCuatrimestre(luProfe, codigoMateria, cuatrimestre);
    res.json(resultado);
    await client.end();
  }

  static async cargarDatosEnAlumnos(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No se envió ningún archivo CSV." });
    }
    const absolutePath = path.isAbsolute(file.path) ? file.path : path.resolve(process.cwd(), file.path);
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    await business.cargarDatosEnAlumnos(absolutePath); 
    res.status(200).json({ message: "Archivo cargado correctamente." });
    await client.end();
    fs.unlinkSync(absolutePath);
  }

}
