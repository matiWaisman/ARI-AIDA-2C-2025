import { Router } from "express";
import { MateriaController } from "../../../application/controllers/controller-materia.ts";

export const materiaRouter = Router();

materiaRouter.get("/materias",MateriaController.getAllMateriasConProfesorYCuatri);
materiaRouter.get("/materiasQueCursa",MateriaController.getAllMateriasQueCursa);
materiaRouter.get("/materiasqueDicta",MateriaController.getAllMateriasQueDicta);
materiaRouter.get("/materiasQueNoCursa",MateriaController.getAllMateriasQueNoCursa);
materiaRouter.get("/materiasqueNoDicta",MateriaController.getAllMateriasQueNoDicta);
materiaRouter.get("/alumnosDeMateria",MateriaController.getAlumnosDeMateriaConNota)
materiaRouter.post("/materias/cursar",MateriaController.inscribirACursar)
materiaRouter.post("/materias/dictar",MateriaController.inscribirADictar)
materiaRouter.post("/materia/alumno", MateriaController.alumnosDeMateriaExcluyendo);
materiaRouter.post("/materias/create", MateriaController.crearMateria);
materiaRouter.post("/materia/profesor", MateriaController.alumnosDeMateriaExcluyendo);
