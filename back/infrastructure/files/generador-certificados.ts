import fs from "fs";
import path from "path";
import type { Alumno } from "../../domain/entity/alumno.ts";

export class CertificadoGenerator {
  private templatePath = path.join(process.cwd(), "src", "certificates", "ongoingDegreeCertificate.html");

  async generarCertificadoHtml(alumno: Alumno): Promise<string> {
    console.log("Alumno en generarCertificadoHtml: ", alumno);
    const fecha = new Date().toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const template = await fs.promises.readFile(this.templatePath, "utf-8");

    const pending = template.match(/\[[^\]]+\]/g);
    console.log("Placeholders encontrados en el template:", pending);


    return template
      .replace(/\[Número de libreta\]/gi, alumno.lu.toString())
      .replace(/\[Nombre y Apellido del estudiante\]/gi, `${alumno.nombres} ${alumno.apellido}`)
      .replace(/\[Título obtenido\]/gi, alumno.titulo)
      .replace(/\[Fecha de emisión\]/gi, fecha);
  }

  private generarNombreArchivo(alumno: Alumno): string {
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toTimeString().slice(0, 8).replace(/:/g, "");
    const lu = alumno.lu.toString().replace(/[\/\\:*?"<>|]/g, "_");
    const apellido = alumno.apellido.replace(/\s+/g, "_").replace(/[\/\\:*?"<>|]/g, "_");

    return `certificado_${lu}_${apellido}_${fecha}_${hora}.html`;
  }

  async generarYGuardarCertificado(alumno: Alumno): Promise<string> {
    const htmlContent = await this.generarCertificadoHtml(alumno);
    const nombreArchivo = this.generarNombreArchivo(alumno);
    const outDir = path.join(process.cwd(), "out");

    await fs.promises.mkdir(outDir, { recursive: true });

    const rutaCompleta = path.join(outDir, nombreArchivo);
    await fs.promises.writeFile(rutaCompleta, htmlContent, "utf-8");
    console.log(`Certificado guardado en: ${rutaCompleta}`);

    return rutaCompleta;
  }
}
