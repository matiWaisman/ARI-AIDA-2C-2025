"use client";

import { useState, useEffect } from "react";

type LabelEncuestaProps = {
  texto: string;
  onChange?: (valor: number) => void;
  valorInicial?: number;
};

export default function LabelEncuesta({ texto, onChange, valorInicial }: LabelEncuestaProps) {
  const [valor, setValor] = useState<number | null>(valorInicial || null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (valorInicial !== undefined && valorInicial > 0) {
      setValor(valorInicial);
    }
  }, [valorInicial]);

  const puntuar = (n: number) => {
    setValor(n);
    onChange?.(n);
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 font-medium text-gray-700 text-left">
          {texto}
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const isFilled = hover ? n <= hover : valor !== null && n <= valor;

            return (
              <button
                key={n}
                onClick={() => puntuar(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                className="text-2xl transition-colors focus:outline-none"
                type="button"
              >
                <span
                  className={
                    isFilled
                      ? "text-sky-400 hover:text-sky-500"
                      : "text-gray-100 hover:text-sky-200"
                  }
                >
                  ★
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
