import { Router } from "express";
import { MateriaController } from "../../../application/controllers/controller-materia.ts";
import { ControllerGenerico } from "../../../application/controllers/controller-generico.ts";
import { tableDefs } from "../../../src/tableDefs.ts";

export const materiaRouter = Router();

// rutas con logica de business
materiaRouter.post("/materia/update", MateriaController.ponerNotaAAlumno);
materiaRouter.get(
  "/materiasQueCursa",
  MateriaController.getAllMateriasQueCursa
);
materiaRouter.get(
  "/materiasqueDicta",
  MateriaController.getAllMateriasQueDicta
);
materiaRouter.get(
  "/materiasQueNoCursa",
  MateriaController.getAllMateriasQueNoCursa
);
materiaRouter.get(
  "/materiasqueNoDicta",
  MateriaController.getAllMateriasQueNoDicta
);
materiaRouter.get(
  "/alumnosDeMateria/:codigoMateria/:cuatrimestre",
  MateriaController.getAlumnosDeMateriaConNota
);
materiaRouter.post(
  "/materias/alumnos",
  MateriaController.alumnosDeMateriaExcluyendo
);
materiaRouter.post(
  "/materias/profesores",
  MateriaController.profesoresDeMateriaExcluyendo
);
materiaRouter.post("/materias/cursar", MateriaController.inscribirACursar);
materiaRouter.post("/materias/dictar", MateriaController.inscribirADictar);
