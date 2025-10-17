import { Router } from "express";
import { AlumnoController } from "../../../application/controllers/controller-alumno.ts";

export const alumnoRouter = Router();

alumnoRouter.get("/lu", AlumnoController.getAlumnoPorLU);
alumnoRouter.get("/fecha", AlumnoController.getAlumnoPorFecha);
alumnoRouter.post("/generar", AlumnoController.generarCertificado);
alumnoRouter.post("/cargarCSV", AlumnoController.cargarDatosEnAlumnos);
alumnoRouter.post("/update", AlumnoController.updateAlumno);
alumnoRouter.post("/delete", AlumnoController.deleteAlumno);
alumnoRouter.get("/all", AlumnoController.getAlumnos); 
alumnoRouter.post("/insert", AlumnoController.insertAlumno);
