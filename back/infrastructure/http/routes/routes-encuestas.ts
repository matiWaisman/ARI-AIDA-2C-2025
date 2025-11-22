import { Router } from "express";
import { EncuestasController } from "../../../application/controllers/controller-encuestas.ts";

export const encuestasRouter = Router();

encuestasRouter.get("/encuestas/get/alumno", EncuestasController.obtenerEncuestasSobreMiComoAlumno);
encuestasRouter.get("/encuestas/get/profesor", EncuestasController.obtenerEncuestasSobreMiComoProfesor);
encuestasRouter.post("/encuestas/create/materia", EncuestasController.crearEncuestaAMateria);
encuestasRouter.post("/encuestas/create/alumno", EncuestasController.crearEncuestaAAlumno);
encuestasRouter.post("/encuestas/create/profesor", EncuestasController.crearEncuestaAProfesor);
encuestasRouter.get("/completarEncuestas/encuestasPendientes", EncuestasController.obtenerEncuestasNoRespondidas);

