import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { AlumnoController } from "../../../application/controllers/controller-alumno.ts";

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({ storage }); 
export const alumnoRouter = Router();

alumnoRouter.get("/alumnos/lu", AlumnoController.getAlumnoPorLU);
alumnoRouter.get("/alumnos/fecha", AlumnoController.getAlumnoPorFecha);
alumnoRouter.post("/alumnos/generar", AlumnoController.generarCertificado);
alumnoRouter.post("/alumnos/cargarCSV", AlumnoController.cargarDatosEnAlumnos);
alumnoRouter.post("/alumnos/update", AlumnoController.updateAlumno);
alumnoRouter.post("/alumnos/delete", AlumnoController.deleteAlumno);
alumnoRouter.get("/alumnos/all", AlumnoController.getAlumnos); 
alumnoRouter.post("/alumnos/insert", AlumnoController.insertAlumno);
alumnoRouter.post("/alumnos/cargarCSV", upload.single("archivo"), AlumnoController.cargarDatosEnAlumnos);
