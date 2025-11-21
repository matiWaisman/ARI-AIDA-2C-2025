"use client";

interface filaMateriaProps {
  codigoMateria: string;
  nombreMateria: string;
  cuatrimestre: string;
  profesor: string;
  onEnter: (codigoMateria: string) => void;
}

export function FilaMateria({
  codigoMateria,
  nombreMateria,
  cuatrimestre,
  profesor,
  onEnter,
}: filaMateriaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 md:items-center md:px-2 py-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="col-span-1 md:col-span-4">
        <p className="md:hidden text-xs text-muted-foreground font-semibold">
          Materia
        </p>
        <p className="font-medium text-foreground">{nombreMateria}</p>
      </div>

      <div className="col-span-1 md:col-span-2">
        <p className="md:hidden text-xs text-muted-foreground font-semibold">
          Cuatrimestre
        </p>
        <p className="text-sm text-foreground">{cuatrimestre}</p>
      </div>

      <div className="col-span-1 md:col-span-4">
        <p className="md:hidden text-xs text-muted-foreground font-semibold">
          Profesor
        </p>
        <p className="text-sm text-foreground">{profesor}</p>
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end">
        <button
          onClick={() => onEnter(codigoMateria)}
        >
        </button>
      </div>
    </div>
  );
}
