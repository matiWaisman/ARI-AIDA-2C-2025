import type { Request, Response } from 'express';
import type { Alumno } from '../types/alumno';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { generarCertificadoHtml } from '../utils/generar-certificado';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// En este archivo estan todas las funciones que requieren una llamada al back
export async function getCertificadoLUFromBackend(req: Request, res: Response): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/app/lu?LU=${req.params.lu}`);
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }
        
        const alumnoData: Alumno = await response.json();
        const certificadoHtml = await generarCertificadoHtml(alumnoData);
        
        res.setHeader('Content-Type', 'text/html');
        res.send(certificadoHtml);
    } catch (error) {
        console.error('Error al consultar backend:', error);
        res.status(500).send(`
            <html>
                <body>
                    <h1>Error</h1>
                    <p>No se pudo obtener el certificado para el LU: ${req.params.lu}</p>
                    <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
                </body>
            </html>
        `);
    }
}



export async function getCertificadoFechaFromBackend(req: Request, res: Response): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/app/fecha?Fecha=${req.params.fecha}`);
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }
        
        const alumnoData: Alumno = await response.json();
        const certificadoHtml = await generarCertificadoHtml(alumnoData);
        
        res.setHeader('Content-Type', 'text/html');
        res.send(certificadoHtml);
    } catch (error) {
        console.error('Error al consultar backend:', error);
        res.status(500).send(`
            <html>
                <body>
                    <h1>Error</h1>
                    <p>No se pudo obtener el certificado para la fecha: ${req.params.fecha}</p>
                    <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
                </body>
            </html>
        `);
    }
}

export async function getCargarCSVFromBackend(req: Request, res: Response): Promise<void> {
    try {
        const fileName = req.params.filePath as string;
        const csvContent = req.body;
        

        const uploadsDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const absolutePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(absolutePath, csvContent);
        const response = await fetch(
            `http://localhost:3000/app/cargarCSV?FilePath=${encodeURIComponent(absolutePath)}`,
            { method: "POST" }
        );

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        res.send("CSV cargado correctamente");
    } catch (error) {
        console.error('Error al consultar backend:', error);
        res.status(500).send("Error al enviar los datos");
    }
}




