import express from "express";
import { getMenu } from './getters/menu';
import { getCertificadoPorLU, getCertificadoPorFecha, getSubirCSV, getSubirCSVJSON } from './getters/modos';
import { getCertificadoLUFromBackend, getAlumnos, updateAlumno, insertAlumno, deleteAlumno } from './getters/api-calls';
import { getCertificadoFechaFromBackend } from './getters/api-calls';
import { getCargarCSVFromBackend } from './getters/api-calls';
import { getTestEndpoint } from './getters/test';

const app = express()
const port = 3001

app.use(express.json({ limit: '10mb' })); // para poder leer el body
app.use(express.urlencoded({ extended: true, limit: '10mb'  })); // para poder leer el body
app.use(express.text({ type: 'text/csv', limit: '10mb' })); // para poder leer el body como texto plano

// Endpoints
app.get('/ask', getTestEndpoint);
app.get('/app/menu', getMenu);
app.get('/app/lu', getCertificadoPorLU);
app.get('/app/fecha', getCertificadoPorFecha);
app.get('/app/archivo', getSubirCSV);
app.get('/app/archivo-json', getSubirCSVJSON);
app.get('/app/alumnos', getAlumnos);
// Rutas con parametros
app.get('/app/lu/:lu', getCertificadoLUFromBackend);
app.get('/app/update/:lu/:nombre/:apellido', updateAlumno);
app.get('/app/insert/:lu', insertAlumno);
app.get('/app/delete/:lu/:nombre/:apellido', deleteAlumno);

app.get('/app/fecha/:fecha', getCertificadoFechaFromBackend);
app.post('/app/archivo/:filePath', getCargarCSVFromBackend);
app.listen(port, () => {
    console.log(`🌐 Frontend corriendo en http://localhost:${port}/app/menu`)
})