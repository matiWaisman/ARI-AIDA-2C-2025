import MenuOption from "./menu_option";

export default function Menu() {
  const options: Map<string, [string, string]> = new Map([
    ["alumnos", ["/alumnos", "Ver, modificar, eliminar y agregar alumnos"]],
    ["inscripciones", ["/inscripciones", "Inscribirse a materias (Alumno)"]],
    ["dictar", ["/dictar", "Anotate a materias para dictar (Profesor)"]],
    ["lu", ["/lu", "Imprimir certificado por LU"]],
    ["fecha", ["/fecha", "Imprimir certificado por fecha de trámite"]],
    ["archivo", ["/archivo", "Subir CSV con novedades de alumnos"]],
  ]);

  return (
    <div className="text-center">
      <div className="space-y-3 max-w-md mx-auto">
        {Array.from(options.values()).map(([href, desc]) => (
          <MenuOption key={href} href={href} description={desc} />
        ))}
      </div>
    </div>
  );
}
