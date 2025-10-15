import MenuOption from "./menu_option";

export default function Menu() {
  const options: Map<string, [string, string]> = new Map([
    ["lu", ["/lu", "Imprimir certificado por LU"]],
    ["fecha", ["/fecha", "Imprimir certificado por fecha de trámite"]],
    ["archivo", ["/archivo", "Subir CSV con novedades de alumnos"]],
  ]);

  return (
    <>
      <h1>AIDA</h1>
      <p>Menú</p>
      {Array.from(options.values()).map(([href, desc]) => (
        <MenuOption key={href} href={href} description={desc} />
      ))}
    </>
  );
}
