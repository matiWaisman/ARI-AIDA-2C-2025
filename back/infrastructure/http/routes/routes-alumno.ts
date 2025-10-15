import { Router } from "express";
import { AlumnoController } from "../../../application/controllers/controller-alumno.ts";

export const alumnoRouter = Router();

alumnoRouter.get("/lu", AlumnoController.getAlumnoPorLU);
alumnoRouter.post("/generar", AlumnoController.generarCertificado);
alumnoRouter.post("/update", AlumnoController.updateAlumno);
alumnoRouter.post("/delete", AlumnoController.deleteAlumno);
alumnoRouter.get("/all", AlumnoController.getAlumnos); 
alumnoRouter.post("/insert", AlumnoController.insertAlumno);

