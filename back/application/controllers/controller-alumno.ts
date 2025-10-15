import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { AlumnoBusiness } from "../../domain/business/alumno-business.ts";

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
    const FilePath = req.query.FilePath as string;

    console.log("Pidiendo file path:", FilePath);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      await business.CargarDatosEnAlumnos(FilePath);

    } catch (error) {
      console.error("Error al obtener alumno:", error);
      res.status(500).json({
        error: "No se pudo obtener los datos del alumno",
        filePath: FilePath,
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }





}
