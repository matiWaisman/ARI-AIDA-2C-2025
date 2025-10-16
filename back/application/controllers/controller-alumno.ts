import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { AlumnoBusiness } from "../../domain/business/alumno-business.ts";
import fs from "fs";
import path from "path";

export class AlumnoController {
  static async getAlumnoPorLU(req: Request, res: Response) {
    const LU = decodeURIComponent(req.query.LU as string);

    console.log("Pidiendo datos de alumno por LU:", LU);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alumno = await business.getAlumnoConLU(LU);

      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado", lu: LU });
      }

      res.json(alumno);
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      res.status(500).json({
        error: "No se pudo obtener los datos del alumno",
        lu: LU,
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }

  // getAlumnoPorFecha
  static async getAlumnoPorFecha(req: Request, res: Response) {
    const fecha = req.query.fecha as string;

    console.log("Pidiendo datos de alumno por Fecha:", fecha);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alumno = await business.hayCertificadosPendientes(fecha);

      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado", fecha: fecha });
      }

      res.json(alumno);
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      res.status(500).json({
        error: "No se pudo obtener los datos del alumno",
        fecha: fecha,
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }

  static async generarCertificado(req: Request, res: Response) {
    const LU = req.query.LU as string;
    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const ruta = await business.generarCertificadoSiAplica(LU);
      res.json({ message: "Certificado generado", path: ruta });
    } catch (error) {
      res.status(500).json({
        error: "Error generando certificado",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }


  static async cargarDatosEnAlumnos(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se envió ningún archivo CSV." });
    }

    const absolutePath = path.isAbsolute(file.path) ? file.path : path.resolve(process.cwd(), file.path);
    console.log("Archivo recibido:", file.originalname, "guardado en:", absolutePath);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      await business.CargarDatosEnAlumnos(absolutePath); 

      res.status(200).json({ message: "Archivo cargado correctamente." });
    } catch (error) {
      console.error("Error al cargar datos en alumnos:", error);
      res.status(500).json({
        error: "No se pudo cargar el archivo CSV.",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
      try {
        fs.unlinkSync(absolutePath);
      } catch (unlinkError) {
        console.warn("No se pudo eliminar archivo temporal:", unlinkError);
      }
    }
  }





}
