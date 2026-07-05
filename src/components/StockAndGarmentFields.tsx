"use client";

import { useState } from "react";
import { StockStatus, GarmentType } from "@/types/product";

const selectClass =
  "rounded-lg border border-white/10 bg-[#101a2c] px-4 py-2 text-white focus:border-[#c9a961] focus:outline-none";

export function StockAndGarmentFields({
  defaultStockStatus = "stock",
  defaultGarmentType,
}: {
  defaultStockStatus?: StockStatus;
  defaultGarmentType?: GarmentType | null;
}) {
  const [stockStatus, setStockStatus] = useState<StockStatus>(defaultStockStatus);

  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-neutral-300">
        Disponibilidad
        <select
          name="stock_status"
          required
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value as StockStatus)}
          className={selectClass}
        >
          <option value="stock">En stock</option>
          <option value="encargue">Por encargue</option>
        </select>
      </label>

      {stockStatus === "encargue" && (
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Tipo de prenda
          <select name="garment_type" required defaultValue={defaultGarmentType || "remera"} className={selectClass}>
            <option value="remera">Remera</option>
            <option value="short">Short</option>
            <option value="campera">Campera</option>
            <option value="conjunto">Conjunto</option>
          </select>
        </label>
      )}
    </>
  );
}
