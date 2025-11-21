import { Router } from "express";
import { CursaController } from "../../../application/controllers/controller-cursa.ts";

export const cursaRouter = Router();

cursaRouter.post("/create/cursada", CursaController.crearCursa);
cursaRouter.get("/get/cursada", CursaController.getCursa);
cursaRouter.post("/materia/update", CursaController.ponerNotaAAlumno);