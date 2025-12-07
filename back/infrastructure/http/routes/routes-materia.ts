import { Router } from "express";
import { MateriaController } from "../../../application/controllers/controller-materia.ts";
import { genericController } from "../../../application/controllers/genericController.ts";
import { tableDefs } from "../../../src/tableDefs.ts";  

export const materiaRouter = Router();

// rutas para operaciones CRUD genéricas
materiaRouter.get("/materias",genericController(tableDefs[5]!).getAllRows);
materiaRouter.post("/materias/create", genericController(tableDefs[5]!).createRow);

// rutas con logica de business
materiaRouter.get("/materiasQueCursa",MateriaController.getAllMateriasQueCursa);
materiaRouter.get("/materiasqueDicta",MateriaController.getAllMateriasQueDicta);
materiaRouter.get("/materiasQueNoCursa",MateriaController.getAllMateriasQueNoCursa);
materiaRouter.get("/materiasqueNoDicta",MateriaController.getAllMateriasQueNoDicta);
materiaRouter.get("/alumnosDeMateria/:codigoMateria/:cuatrimestre",MateriaController.getAlumnosDeMateriaConNota)
materiaRouter.post("/materias/alumnos", MateriaController.alumnosDeMateriaExcluyendo);
materiaRouter.post("/materias/profesores", MateriaController.profesoresDeMateriaExcluyendo);
materiaRouter.post("/materias/cursar",MateriaController.inscribirACursar)
materiaRouter.post("/materias/dictar",MateriaController.inscribirADictar)
