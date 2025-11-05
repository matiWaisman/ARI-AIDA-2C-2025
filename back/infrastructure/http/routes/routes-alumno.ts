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

alumnoRouter.get("/lu", AlumnoController.getAlumnoPorLU);
alumnoRouter.get("/fecha", AlumnoController.getAlumnoPorFecha);
alumnoRouter.post("/generar", AlumnoController.generarCertificado);
alumnoRouter.post("/cargarCSV", AlumnoController.cargarDatosEnAlumnos);
alumnoRouter.post("/update", AlumnoController.updateAlumno);
alumnoRouter.post("/delete", AlumnoController.deleteAlumno);
alumnoRouter.get("/all", AlumnoController.getAlumnos); 
alumnoRouter.post("/insert", AlumnoController.insertAlumno);
alumnoRouter.post("/cargarCSV", upload.single("archivo"), AlumnoController.cargarDatosEnAlumnos);
