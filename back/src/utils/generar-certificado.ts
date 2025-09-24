import type { Alumno } from "../types/alumno.ts";
import fs from 'fs';
import path from 'path';

async function cargarTemplate(): Promise<string> {
  const templatePath = path.join(process.cwd(), 'src', 'certificates', 'ongoingDegreeCertificate.html');
  return await fs.promises.readFile(templatePath, 'utf-8');
}

export async function generarCertificadoHtml(alumno: Alumno): Promise<string> {
  const fecha = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const template = await cargarTemplate();
  
  // Reemplazar los placeholders con los datos del alumno
  const htmlGenerado = template
    .replace(/\[Número de libreta\]/g, alumno.lu.toString())
    .replace(/\[Nombre y Apellido del estudiante\]/g, `${alumno.nombres} ${alumno.apellido}`)
    .replace(/\[Título obtenido\]/g, alumno.titulo)
    .replace(/\[Fecha de emisión\]/g, fecha);

  return htmlGenerado;
}

function generarNombreArchivo(alumno: Alumno): string {
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 10); // YYYY-MM-DD
  const hora = ahora.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
  const lu = alumno.lu.toString().replace(/[\/\\:*?"<>|]/g, '_'); // Sanitizar caracteres especiales
  const apellido = alumno.apellido.replace(/\s+/g, '_').replace(/[\/\\:*?"<>|]/g, '_');
  
  return `certificado_${lu}_${apellido}_${fecha}_${hora}.html`;
}

export async function generarYGuardarCertificado(alumno: Alumno): Promise<string> {
  const htmlContent = await generarCertificadoHtml(alumno);
  const nombreArchivo = generarNombreArchivo(alumno);
  const rutaCompleta = path.join(process.cwd(), 'out', nombreArchivo);
  
  // Asegurar que el directorio out existe
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  await fs.promises.writeFile(rutaCompleta, htmlContent, 'utf-8');
  console.log(`Certificado guardado en: ${rutaCompleta}`);
  
  return rutaCompleta;
}
