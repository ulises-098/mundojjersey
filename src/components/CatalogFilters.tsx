"use client";

import { useRouter } from "next/navigation";
import { ProductCategory, StockStatus } from "@/types/product";

export function CatalogFilters({
  categoria,
  stock,
}: {
  categoria: ProductCategory | "todas";
  stock: StockStatus | "todas";
}) {
  const router = useRouter();

  function updateParam(key: "categoria" | "stock", value: string) {
    const next = { categoria, stock, [key]: value };
    const params = new URLSearchParams();
    if (next.categoria !== "todas") params.set("categoria", next.categoria);
    if (next.stock !== "todas") params.set("stock", next.stock);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  const selectClass =
    "rounded-full border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 focus:border-emerald-500 focus:outline-none";

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      <select
        value={categoria}
        onChange={(e) => updateParam("categoria", e.target.value)}
        className={selectClass}
      >
        <option value="todas">Categoría: Todas</option>
        <option value="retro">Versión Retro</option>
        <option value="jugador">Versión Jugador</option>
      </select>

      <select
        value={stock}
        onChange={(e) => updateParam("stock", e.target.value)}
        className={selectClass}
      >
        <option value="todas">Disponibilidad: Todas</option>
        <option value="stock">En stock</option>
        <option value="encargue">Por encargue</option>
      </select>
    </div>
  );
}
