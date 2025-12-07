import { Router } from "express";
import { EncuestasController } from "../../../application/controllers/controller-encuestas.ts";
import { genericController } from "../../../application/controllers/genericController.ts";  
import { tableDefs } from "../../../src/tableDefs.ts";      

export const encuestasRouter = Router();


// Rutas CRUD generico
encuestasRouter.post("/encuestas/create/materia", genericController(tableDefs[8]!).createRow);
encuestasRouter.post("/encuestas/create/alumno", genericController(tableDefs[7]!).createRow);
encuestasRouter.post("/encuestas/create/profesor", genericController(tableDefs[9]!).createRow);

// Rutas con logica de business
encuestasRouter.get("/encuestas/get/alumno", EncuestasController.obtenerEncuestasSobreMiComoAlumno);
encuestasRouter.get("/encuestas/get/materia/:codigoMateria/:cuatrimestre", EncuestasController.obtenerEncuestasDeMateriaDeCuatri);
encuestasRouter.get("/encuestas/get/profesor/:codigoMateria/:cuatrimestre", EncuestasController.obtenerEncustasDeProfesorEnMateriaYCuatri);     //IMPORTANTE NO MEZCLAR
encuestasRouter.get("/encuestas/get/alumno/:codigoMateria/:cuatrimestre", EncuestasController.obtenerEncuestasDeAlumnosEnMateriaYCuatri);
encuestasRouter.get("/encuestas/get/profesor", EncuestasController.obtenerEncuestasSobreMiComoProfesor);
encuestasRouter.get("/completarEncuestas/encuestasPendientes", EncuestasController.obtenerEncuestasNoRespondidas);

