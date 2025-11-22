import AlumnosDeMateriaClient from "./AlumnosDeMateriaClient";

type Props = {
  params: {
    codigoMateria: string;
    cuatrimestre: string;
  };
};

export default async function Page({ params }: Props) {
  const { codigoMateria, cuatrimestre } = params;

  // Fetch en el server — si querés hacerlo acá:
  const res = await fetch(
    `${process.env.API_URL}/alumnosDeMateria/${codigoMateria}?cuatrimestre=${cuatrimestre}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Error al obtener los alumnos");
  }

  const alumnos = await res.json();

  return (
    <AlumnosDeMateriaClient
      codigoMateria={codigoMateria}
      cuatrimestre={cuatrimestre}
      alumnos={alumnos}
    />
  );
}
