import { Router } from "express";
import { MateriaController } from "../../../application/controllers/controller-materia.ts";

export const materiaRouter = Router();

materiaRouter.get("/materias",MateriaController.getAllMateriasConProfesorYCuatri);
materiaRouter.post("/materias/cursar",MateriaController.inscribirACursar)
materiaRouter.post("/materias/dictar",MateriaController.inscribirADictar)
materiaRouter.post("/materias/create", MateriaController.crearMateria);