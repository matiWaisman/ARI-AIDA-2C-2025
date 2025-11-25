import { use } from "react";
import CompletarEncuestaDictadoClient from "./CompletarEncuestaDictadoClient";

type Props = {
  params: Promise<{ codigoMateria: string }>;
};

export default function CompletarEncuestaDictadoPage({ params }: Props) {
  const unwrapped = use(params);
  const codigoMateria = unwrapped.codigoMateria;

  return <CompletarEncuestaDictadoClient codigoMateria={codigoMateria} />;
}


