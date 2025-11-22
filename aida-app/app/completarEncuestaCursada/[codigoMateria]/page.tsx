"use client";

type Props = {
  params: { codigoMateria: string };
};

export default function CompletarEncuestaCursadaPage({ params }: Props) {
  var codigoMateriaACompetarEncuesta = params.codigoMateria;
  return (
    <div>
      <h1>Completar encuesta de {codigoMateriaACompetarEncuesta}</h1>
    </div>
  );
}
