import type { Alumno } from "../types/alumno.ts";

export function generarCertificadoHtml(alumno: Alumno): string {
  const fecha = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Título en Trámite</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@300;400&display=swap');

    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #eaeaea;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .certificate-container {
      width: 210mm;
      min-height: 297mm;
      background-color: white;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      padding: 30mm;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 1;

    }

    .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 70%;
        opacity: 0.07;
        transform: translate(-50%, -50%);
        z-index: 0; /* debajo del resto */
        pointer-events: none;
        }

    .border-design * {
      position: absolute;
      top: 12mm;
      left: 12mm;
      right: 12mm;
      bottom: 12mm;
      border: 5px double #2c3e50;
      border-radius: 15px;
      pointer-events: none;
       z-index: 1;
    }


    .university-header {
      text-align: center;
      margin-bottom: 30px;
      z-index: 2;
      position: relative;
    }

    .university-name {
      font-family: 'Merriweather', serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a2b47;
    }

    .university-subtitle {
      font-size: 15px;
      color: #555;
      margin-top: 5px;
    }

    .certificate-title {
      text-align: center;
      font-family: 'Merriweather', serif;
      font-size: 30px;
      font-weight: bold;
      color: #1a2b47;
      margin: 40px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      z-index: 2;
      position: relative;
    }

    .certificate-body {
      margin: 30px 0;
      line-height: 1.8;
      font-size: 17px;
      z-index: 2;
      position: relative;
    }

    .student-data {
      margin: 25px 0;
    }

    .data-field {
      margin-bottom: 12px;
      display: flex;
    }

    .data-label {
      font-weight: bold;
      min-width: 180px;
      color: #1a2b47;
    }

    .signature-area {
      margin-top: 70px;
      display: flex;
      justify-content: space-between;
      z-index: 2;
      position: relative;
    }

    .signature-box {
      text-align: center;
      width: 40%;
    }

    .signature-line {
      border-top: 1px solid #1a2b47;
      margin: 60px 0 10px;
    }

    .signature-label {
      font-size: 15px;
      color: #555;
    }

    .certificate-footer {
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: #555;
      z-index: 2;
      position: relative;
    }

    @media print {
      body {
        background-color: white;
        padding: 0;
      }

      .certificate-container {
        box-shadow: none;
        width: 100%;
        height: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="border-design"></div>

    <div class="university-header">
      <div class="university-name">UNIVERSIDAD DE BUENOS AIRES</div>
      <div class="university-subtitle">[Facultad - Dirección completa - Ciudad - País]</div>
    </div>

    <div class="certificate-title">Certificado de Título en Trámite</div>
  
    <div class="certificate-body">
      <p>El/la abajo firmante certifica que:</p>

      <div class="student-data">
        <div class="data-field">
          <span class="data-label">Número de Libreta:</span>
          <span>${alumno.lu}</span>
        </div>
        <div class="data-field">
          <span class="data-label">Nombre y Apellido:</span>
          <span>${alumno.nombres} ${alumno.apellido}</span>
        </div>
        <div class="data-field">
          <span class="data-label">Título Obtenido:</span>
          <span>${alumno.titulo}</span>
        </div>
        <div class="data-field">
          <span class="data-label">Fecha:</span>
          <span>${fecha}</span>
        </div>
      </div>

      <p>Ha completado satisfactoriamente todos los requisitos académicos correspondientes a la carrera y se encuentra en trámite la expedición de su título oficial.</p>
      <p>Se expide el presente certificado a solicitud del interesado para los fines que estime convenientes.</p>
    </div>

    <img src="" alt="Logo de la facultad" class="watermark">

    <div class="signature-area">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Firma de la Autoridad Competente</div>
      </div>

      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Sello de la Institución</div>
      </div>
    </div>

    <div class="certificate-footer">
      <p>Certificado emitido electrónicamente - Para verificar la autenticidad contactar con [correo de la facultad]</p>
    </div>
  </div>
</body>
</html>`;
}
