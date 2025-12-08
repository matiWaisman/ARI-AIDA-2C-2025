import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { AlumnoController } from "../../../application/controllers/controller-alumno.ts";
import { genericController } from "../../../application/controllers/genericController.ts";
import { tableDefs } from "../../../src/tableDefs.ts";

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({ storage });
export const alumnoRouter = Router();

// rutas con logica de business
alumnoRouter.get("/alumnos/get/:lu", AlumnoController.generarCertificado);
alumnoRouter.post("/alumnos/cargarCSV",upload.single("archivo"),AlumnoController.cargarDatosEnAlumnos);
alumnoRouter.get("/alumnos/profesor/:luProfe/:codigoMateria/:cuatrimestre",AlumnoController.getAlumnosDeProfesorPorMateriaYCuatrimestre);