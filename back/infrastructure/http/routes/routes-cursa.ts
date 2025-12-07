import { Router } from "express";
import { CursaController } from "../../../application/controllers/controller-cursa.ts";
import { genericController } from "../../../application/controllers/genericController.ts";
import { tableDefs } from "../../../src/tableDefs.ts";

export const cursaRouter = Router();

//rutas con logica de business
cursaRouter.post("/materia/update", CursaController.ponerNotaAAlumno);