import express from 'express';
import { Client } from 'pg';
import { readFile } from 'node:fs/promises';

const app = express();
const port = 3000;

app.get('/certificado/:id', async (req, res) => {
    const clientDb = new Client();
    await clientDb.connect();
    const id = req.params.id;
    const result = await clientDb.query('SELECT * FROM aida.alumnos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        res.status(404).send('Alumno no encontrado');
        return;
    }
    const alumno = result.rows[0];
    const plantilla = await readFile('recursos/plantilla-certificado.html', 'utf8');
    const certificado = plantilla
        .replace('[Número de libreta]', alumno.nro_libreta || '')
        .replace('[Nombre y Apellido del estudiante]', alumno.nombre + ' ' + alumno.apellido)
        .replace('[Título obtenido]', alumno.titulo)
        .replace('[Fecha de emisión]', new Date().toLocaleDateString());
    res.send(certificado);
    await clientDb.end();
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});