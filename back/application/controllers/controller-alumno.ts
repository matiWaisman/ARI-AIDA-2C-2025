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

  static async getAlumnoPorLU(req: Request, res: Response) {
    const LU = decodeURIComponent(req.query.LU as string);
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const alumno = await business.getAlumnoConLU(LU);
    if (!alumno) {
      return res.status(404).json({ error: "No existe ese alumno con LU", lu: LU });
    }
    res.json(alumno);
    await client.end();
  }

  static async getAlumnoPorFecha(req: Request, res: Response) {
    const fecha = req.query.fecha as string;
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const alumno = await business.hayCertificadosPendientes(fecha);
    if (!alumno) {
      return res.status(404).json({ error: "No existe alumno por fecha", fecha: fecha });
    }
    res.json(alumno);
    await client.end();
  }

  static async generarCertificado(req: Request, res: Response) {
    const LU = req.query.LU as string;
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
    console.log("Llegue a cargarDatosEnAlumnos");
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

  static async getAlumnos(req: Request, res: Response) {
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const alumnos = await business.getAlumnos();
    res.json(alumnos);
    await client.end();
  }

  static async updateAlumno(req: Request, res: Response) {
    const { lu, nombres, apellido } = req.body;
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    const alumno = await business.updateAlumno(lu, nombres, apellido);
    res.json(alumno);
    await client.end();
  }

  static async deleteAlumno(req: Request, res: Response) {
    const LU = req.query.LU as string;
    const {client, business} = await AlumnoController._createDbClientAndInitializeBusiness()
    await business.deleteAlumno(LU);
    res.status(200).json({ message: "Alumno eliminado", lu: LU });
    await client.end();

  }

  static async insertAlumno(req: Request, res: Response) {
  const { lu, nombres, apellido, titulo, titulo_en_tramite, egreso } = req.body;
  
  if (!lu || !nombres || !apellido) {
    return res.status(400).json({ message: "LU, nombres y apellido son obligatorios" });
  }

  const { client, business } = await AlumnoController._createDbClientAndInitializeBusiness();

  try {
    const alumno = await business.crearAlumnoCompleto({
      lu,
      nombres,
      apellido,
      titulo,
      titulo_en_tramite,
      egreso
    });

    res.status(200).json(alumno);
  } finally {
    await client.end();
  }
}

}
