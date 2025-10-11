import type { Request, Response } from 'express';
import type { Alumno } from '../types/alumno';
import { generarCertificadoHtml } from '../utils/generar-certificado';

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
