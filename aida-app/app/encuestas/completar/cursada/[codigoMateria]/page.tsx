import { use } from "react";
import CompletarEncuestaCursadaClient from "./CompletarEncuestaCursadaClient";

type Props = {
  params: Promise<{ codigoMateria: string }>;
};

export default function CompletarEncuestaCursadaPage({ params }: Props) {
  const unwrapped = use(params);
  const codigoMateria = unwrapped.codigoMateria;

  return <CompletarEncuestaCursadaClient codigoMateria={codigoMateria} />;
}

