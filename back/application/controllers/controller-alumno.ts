import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { AlumnoBusiness } from "../../domain/business/alumno-business.ts";
import fs from "fs";
import path from "path";

export class AlumnoController {

  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new AlumnoBusiness(client);
    return { client, business };
  }

  static async getAlumnoPorLU(req: Request, res: Response) {
    const LU = decodeURIComponent(req.query.LU as string);
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alumno = await business.getAlumnoConLU(LU);
    if (!alumno) {
      return res.status(404).json({ error: "No existe ese alumno con LU", lu: LU });
    }
    res.json(alumno);
    await client.end();
  }

  static async getAlumnoPorFecha(req: Request, res: Response) {
    const fecha = req.query.fecha as string;
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alumno = await business.hayCertificadosPendientes(fecha);
    if (!alumno) {
      return res.status(404).json({ error: "No existe alumno por fecha", fecha: fecha });
    }
    res.json(alumno);
    await client.end();
  }

  static async generarCertificado(req: Request, res: Response) {
    const LU = req.query.LU as string;
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const ruta = await business.generarCertificadoSiAplica(LU);
    res.json({ message: "Certificado generado", path: ruta });
    await client.end();
}


  static async cargarDatosEnAlumnos(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No se envió ningún archivo CSV." });
    }
    const absolutePath = path.isAbsolute(file.path) ? file.path : path.resolve(process.cwd(), file.path);
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    await business.CargarDatosEnAlumnos(absolutePath); 
    res.status(200).json({ message: "Archivo cargado correctamente." });
    await client.end();
    fs.unlinkSync(absolutePath);
  }

  static async getAlumnos(req: Request, res: Response) {
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alummnos = await business.getAlumnos();
    res.json(alummnos);
    await client.end();
  }

  static async updateAlumno(req: Request, res: Response) {
    const { lu, nombres, apellido } = req.body;
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alumno = await business.updateAlumno(lu, nombres, apellido);
    res.json(alumno);
    await client.end();
  }

  static async deleteAlumno(req: Request, res: Response) {
    const LU = req.query.LU as string;
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alummno = await business.deleteAlumno(LU);
    res.status(200).json({ message: "Alumno eliminado", lu: LU });
    await client.end();
  
  }

  static async insertAlumno(req: Request, res: Response) {
    const { lu, nombres, apellido } = req.body;
    const {client, business} = await this._createDbClientAndInitializeBusiness()
    const alummno = await business.insertAlumno(lu, nombres, apellido);
    res.status(200).json({ message: "Alumno creado", lu: lu });
    await client.end();  
  }
}
