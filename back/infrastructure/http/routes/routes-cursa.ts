import { Router } from "express";
import { CursaController } from "../../../application/controllers/controller-cursa.ts";
import { genericController } from "../../../application/controllers/genericController.ts";
import { tableDefs } from "../../../src/tableDefs.ts";

export const cursaRouter = Router();

cursaRouter.post("/create/cursada", genericController(tableDefs[3]!).createRow);
cursaRouter.get("/get/cursada", CursaController.getCursa);
cursaRouter.post("/materia/update", CursaController.ponerNotaAAlumno);