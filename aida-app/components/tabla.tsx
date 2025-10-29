import { Alumno } from "@/types/alumno";
import FilaTabla from "@/components/filaTabla";

type TablaProps = {
  alumnos: Alumno[];
};

export default function Tabla({alumnos}: TablaProps) {
    return (
      <div className="text-center">
        <div className="space-y-3 max-w-md mx-auto">
          {alumnos.map((alumnoActual) => (
            <FilaTabla alumno={alumnoActual} />
          ))}
        </div>
      </div>
    );
}
