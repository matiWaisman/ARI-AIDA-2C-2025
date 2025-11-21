import { Router } from "express";
import { EncuestasController } from "../../../application/controllers/controller-encuestas.ts";

export const encuestasRouter = Router();

encuestasRouter.post("/encuestas/get/materia", EncuestasController.obtenerEncuestasSobreMiComoAlumno);
encuestasRouter.post("/encuestas/get/profesor", EncuestasController.obtenerEncuestasSobreMiComoProfesor);
encuestasRouter.post("/encuestas/create/profesor", EncuestasController.crearEncuestaAMateria);
encuestasRouter.get("/encuestas/create/alumno", EncuestasController.crearEncuestaAAlumno);
encuestasRouter.get("/encuestas/create/profesor", EncuestasController.crearEncuestaAProfesor);

