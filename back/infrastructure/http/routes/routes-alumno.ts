import { Router } from "express";
import { AlumnoController } from "../../../application/controllers/controller-alumno.ts";

export const alumnoRouter = Router();

alumnoRouter.get("/lu", AlumnoController.getAlumnoPorLU);
alumnoRouter.post("/generar", AlumnoController.generarCertificado);
