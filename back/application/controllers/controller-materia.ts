import type { Request, Response } from "express";
import { createDbClient } from "../../infrastructure/db/db-client.js";
import { Business } from "../../domain/business/business.ts";

export class MateriaController {
  static async _createDbClientAndInitializeBusiness() {
    const client = createDbClient();
    await client.connect();
    const business = new Business(client);
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

  static async getAllMateriasQueNoCursa(req: Request, res: Response) {
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    const id = req.session.usuario?.id;
    const materias = await business.getAllMateriasQueNoParticipa(id, "cursa", "Alumno");
    res.status(200).json(materias);
    await client.end();
  }

  static async getAllMateriasQueNoDicta(req: Request, res: Response) {
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    const id = req.session.usuario?.id;
    const materias = await business.getAllMateriasQueNoParticipa(id, "dicta", "Profesor");
    res.status(200).json(materias);
    await client.end();
  }

  static async getAllMateriasQueCursa(req: Request, res: Response) {
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    const id = req.session.usuario?.id;
    if (!id) {
      await client.end();
      return res.status(200).json([]);
    }
    const materias = await business.getAllMateriasQueParticipa(id, "cursa", "Alumno");
    res.status(200).json(materias);
    await client.end();
  }

  static async getAllMateriasQueDicta(req: Request, res: Response) {
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();
    const id = req.session.usuario?.id;
    if (!id) {
      await client.end();
      return res.status(200).json([]);
    }
    const materias = await business.getAllMateriasQueParticipa(id, "dicta", "Profesor");
    res.status(200).json(materias);
    await client.end();
  }


  static async inscribirACursar(req: Request, res: Response) {
    let codigoMateria = req.query.codigoMateria as string;
    if (codigoMateria) {
      codigoMateria = decodeURIComponent(codigoMateria);
    }
    const id = req.session.usuario?.id;

    if (!id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!codigoMateria) {
      return res.status(400).json({ error: "Falta el código de materia" });
    }

    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    try {
      await business.inscribirAlumnoConIdDeUsuario(codigoMateria, id);
      await client.end();
      return res.status(200).json({
        message: "Inscripción a cursar realizada correctamente",
      });
    } catch (error: any) {
      await client.end();
      return res.status(500).json({ error: error.message || "Error al inscribirse" });
    }
  }

  static async inscribirADictar(req: Request, res: Response) {
    const codigoMateria = req.query.codigoMateria as string;
    const id = req.session.usuario?.id;
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    await business.inscribirProfesorConIdDeUsuario(codigoMateria, id);

    await client.end();

    return res.status(200).json({
      message: "Inscripción como profesor realizada correctamente",
    });
  }

  static async alumnosDeMateriaExcluyendo(req: Request, res: Response) {
    const { codigoMateria, cuatrimestre, luAExcluir } = req.body;
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    let alumnos;
    if (luAExcluir) {
      alumnos = await business.obtenerCompanierosDeMateria(
        codigoMateria,
        cuatrimestre,
        luAExcluir,
      );
    } else {
      alumnos = await business.obtenerAlumnosDeMateria(
        codigoMateria,
        cuatrimestre,
      );
    }
    
    res.status(200).json(alumnos);
    await client.end();
  }

  static async profesoresDeMateriaExcluyendo(req: Request, res: Response) {
    const { codigoMateria, cuatrimestre, luAExcluir } = req.body;
    
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    let profesores;
    if (luAExcluir) {
      profesores = await business.obtenerProfesoresDeMateriaExcluyendo(
        codigoMateria,
        cuatrimestre,
        luAExcluir
      );
    } else {
      profesores = await business.obtenerProfesoresDeMateria(
        codigoMateria,
        cuatrimestre
      );
    }

    res.status(200).json(profesores);
    await client.end();
  }


  static async ponerNotaAAlumno(req: Request, res: Response) {
    const { codigoMateria, cuatrimestre, luAlumno, nota } = req.body;
    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    await business.ponerNotaAAlumno(codigoMateria, cuatrimestre, luAlumno, nota);
    
    res.status(200).json({ message: "Nota actualizada correctamente" });
    await client.end();
  }

  static async getAlumnosDeMateriaConNota(req: Request, res: Response) {
    const codigoMateria = req.query.codigoMateria as string;
    const cuatrimestre = req.query.cuatrimestre as string;

    const { client, business } =
      await MateriaController._createDbClientAndInitializeBusiness();

    const alumnos = await business.obtenerAlumnosDeMateriaConNota(codigoMateria, cuatrimestre);

    res.status(200).json(alumnos);
    await client.end();
  }
}
