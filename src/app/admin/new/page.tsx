import { createProduct } from "../actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Nueva remera</h1>
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <form action={createProduct} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Fotos (podés elegir varias)
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            required
            className="text-sm text-neutral-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Nombre de la remera
          <input
            name="name"
            required
            placeholder="Ej: River Plate Titular 2024"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Club o selección
          <input
            name="club"
            required
            placeholder="Ej: River Plate"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Temporada (opcional)
          <input
            name="season"
            placeholder="Ej: 2001"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Categoría
          <select
            name="category"
            required
            defaultValue="jugador"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="retro">Versión Retro</option>
            <option value="jugador">Versión Jugador</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Disponibilidad
          <select
            name="stock_status"
            required
            defaultValue="stock"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="stock">En stock</option>
            <option value="encargue">Por encargue</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Precio (ARS)
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            required
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Talles disponibles (separados por coma)
          <input
            name="sizes"
            placeholder="S, M, L, XL"
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
        >
          Guardar remera
        </button>
      </form>
    </main>
  );
}
