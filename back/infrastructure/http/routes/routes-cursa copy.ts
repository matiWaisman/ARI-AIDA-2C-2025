import { Router } from "express";
import { EncuestasController } from "../../../application/controllers/controller-encuestas.ts";

export const encuestasRouter = Router();

encuestasRouter.post("/encuestas/create/materia", EncuestasController.obtenerEncuestasSobreMiComoAlumno);
encuestasRouter.post("/encuestas/create/alumno", EncuestasController.obtenerEncuestasSobreMiComoProfesor);
encuestasRouter.post("/encuestas/create/profesor", EncuestasController.crearEncuestaAMateria);
encuestasRouter.get("/encuestas/get/alumno", EncuestasController.crearEncuestaAAlumno);
encuestasRouter.get("/encuestas/get/profesor", EncuestasController.crearEncuestaAProfesor);

