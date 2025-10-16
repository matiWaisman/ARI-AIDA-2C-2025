import MenuOption from "./menu_option";

export default function Menu() {
  const options: Map<string, [string, string]> = new Map([
    ["lu", ["/lu", "Imprimir certificado por LU"]],
    ["fecha", ["/fecha", "Imprimir certificado por fecha de trámite"]],
    ["archivo", ["/archivo", "Subir CSV con novedades de alumnos"]],
  ]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">AIDA</h1>
      <h2 className="text-sm text-gray-500 mb-6">Menú</h2>
      <div className="space-y-3 max-w-md mx-auto">
        {Array.from(options.values()).map(([href, desc]) => (
          <MenuOption key={href} href={href} description={desc} />
        ))}
      </div>
    </div>
  );
}
