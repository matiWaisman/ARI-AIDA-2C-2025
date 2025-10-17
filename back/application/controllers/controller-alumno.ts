import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { AlumnoBusiness } from "../../domain/business/alumno-business.ts";

export class AlumnoController {
  static async getAlumnoPorLU(req: Request, res: Response) {
    const LU = req.query.LU as string;

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
    const Fecha = req.query.Fecha as string;

    console.log("Pidiendo datos de alumno por Fecha:", Fecha);

    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alumno = await business.hayCertificadosPendientes(Fecha);

      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado", fecha: Fecha });
      }

      res.json(alumno);
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      res.status(500).json({
        error: "No se pudo obtener los datos del alumno",
        fecha: Fecha,
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






  static async getAlumnos(req: Request, res: Response) {
    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alummnos = await business.getAlumnos();
      res.json(alummnos);
    } catch (error) {
      res.status(500).json({
        error: "Error obteniendo alumnos",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }


  static async updateAlumno(req: Request, res: Response) {
    const { lu, nombres, apellido } = req.body;
    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alumno = await business.updateAlumno(lu, nombres, apellido);
      res.json(alumno);
    } catch (error) {
      res.status(500).json({
        error: "Error obteniendo alumnos",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  }



  static async deleteAlumno(req: Request, res: Response) {
    const LU = req.query.LU as string;
    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alummno = await business.deleteAlumno(LU);
      res.status(200).json({ message: "Alumno eliminado", lu: LU });
      
    } catch (error) {
      res.status(500).json({
        error: "Error eliminando alumno",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  
  }

  static async insertAlumno(req: Request, res: Response) {
    const { lu, nombres, apellido } = req.body;
    const client = createDbClient();
    await client.connect();

    try {
      const business = new AlumnoBusiness(client);
      const alummno = await business.insertAlumno(lu, nombres, apellido);
      res.status(200).json({ message: "Alumno creado", lu: lu });
      
    } catch (error) {
      res.status(500).json({
        error: "Error creando alumno",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await client.end();
    }
  
  }
}
