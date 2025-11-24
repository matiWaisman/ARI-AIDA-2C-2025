\"use client\";

import { useState } from \"react\";
import { apiClient } from \"@/apiClient/apiClient\";
import { useUser } from \"@/contexts/UserContext\";
import LoadingScreen from \"@/components/loadingScreen\";
import ErrorScreen from \"@/components/errorScreen\";

export default function Archivo() {
  const { usuario, loading } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<\"success\" | \"error\" | null>(null);
  const [message, setMessage] = useState(\"\");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || usuario.esProfesor !== true) {
      setStatus(\"error\");
      setMessage(\"No tenés permisos para realizar esta acción.\");
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append(\"archivo\", file);
      try {
        await apiClient(\"/cargarCSV\", {
          method: \"POST\",
          body: formData as any,
        });

        setStatus(\"success\");
        setMessage(\"Datos cargados correctamente\");
      } catch (err: any) {
        setStatus(\"error\");
        setMessage(err?.message || \"Error de red o del servidor\");
      }
    }
  };

  if (loading) return <LoadingScreen mensaje=\"Cargando usuario...\" />;
  if (!usuario || usuario.esProfesor !== true) {
    return <ErrorScreen error=\"No tenés permisos para acceder a esta página.\" />;
  }

  return (
    <form onSubmit={handleSubmit} className=\"space-y-4\">
      <h2 className=\"heading\">Subir archivo CSV</h2>
      <div>
        <label className=\"label\" htmlFor=\"archivo\">
          Subí tu archivo
        </label>
        <input
          id=\"archivo\"
          className=\"input\"
          type=\"file\"
          name=\"archivo\"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />
      </div>
      <button type=\"submit\" className=\"btn-primary\">
        Subir archivo
      </button>
      {status && (
        <div
          className={status === \"success\" ? \"alert-success\" : \"alert-error\"}
        >
          {message}
        </div>
      )}
    </form>
  );
}
