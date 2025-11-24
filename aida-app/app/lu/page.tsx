\"use client\";

import Formulario from \"@/components/formulario\";
import { useUser } from \"@/contexts/UserContext\";
import LoadingScreen from \"@/components/loadingScreen\";
import ErrorScreen from \"@/components/errorScreen\";

export default function LU() {
  const { usuario, loading } = useUser();

  if (loading) return <LoadingScreen mensaje=\"Cargando usuario...\" />;
  if (!usuario || usuario.esProfesor !== true) {
    return <ErrorScreen error=\"No tenés permisos para acceder a esta página.\" />;
  }

  return (
    <Formulario
      title=\"Obtener el certificado de título en trámite\"
      nombreLabel=\"Libreta Universitaria\"
      inputType=\"text\"
      nombreInput=\"lu\"
      hrefCertificado=\"/lu\"
    />
  );
}
