"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCategory, StockStatus, GarmentType, GARMENT_LABELS } from "@/types/product";

export function CatalogFilters({
  categoria,
  stock,
  tipo,
  q,
}: {
  categoria: ProductCategory | "todas";
  stock: StockStatus | "todas";
  tipo: GarmentType | "todas";
  q: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (q !== prevQ) {
    setPrevQ(q);
    setSearch(q);
  }

  function navigate(next: {
    categoria: string;
    stock: string;
    tipo: string;
    q: string;
  }) {
    const params = new URLSearchParams();
    if (next.categoria !== "todas") params.set("categoria", next.categoria);
    if (next.stock !== "todas") params.set("stock", next.stock);
    if (next.stock === "encargue" && next.tipo !== "todas") {
      params.set("tipo", next.tipo);
    }
    if (next.q) params.set("q", next.q);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function updateCategoria(value: string) {
    navigate({ categoria: value, stock, tipo, q });
  }

  function updateStock(value: string) {
    navigate({ categoria, stock: value, tipo: "todas", q });
  }

  function updateTipo(value: string) {
    navigate({ categoria, stock, tipo: value, q });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ categoria, stock, tipo, q: value });
    }, 400);
  }

  const selectClass =
    "rounded-full border border-white/10 bg-[#101a2c] px-4 py-2 text-sm font-semibold text-neutral-200 focus:border-[#c9a961] focus:outline-none";

  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Buscar por nombre o club..."
        className="w-full max-w-sm rounded-full border border-white/10 bg-[#101a2c] px-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-[#c9a961] focus:outline-none"
      />
      <div className="flex flex-wrap justify-center gap-3">
        <select
          value={categoria}
          onChange={(e) => updateCategoria(e.target.value)}
          className={selectClass}
        >
          <option value="todas">Categoría: Todas</option>
          <option value="retro">Versión Retro</option>
          <option value="jugador">Versión Jugador</option>
        </select>

        <select
          value={stock}
          onChange={(e) => updateStock(e.target.value)}
          className={selectClass}
        >
          <option value="todas">Disponibilidad: Todas</option>
          <option value="stock">En stock</option>
          <option value="encargue">Por encargue</option>
        </select>

        {stock === "encargue" && (
          <select
            value={tipo}
            onChange={(e) => updateTipo(e.target.value)}
            className={selectClass}
          >
            <option value="todas">Tipo de prenda: Todas</option>
            {Object.entries(GARMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
