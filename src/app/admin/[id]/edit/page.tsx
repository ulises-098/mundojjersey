import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../../actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Product } from "@/types/product";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single<Product>();

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Editar remera</h1>
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <form action={updateProduct} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={product.id} />
        <input
          type="hidden"
          name="current_image_urls"
          value={product.image_urls.join(",")}
        />

        <div className="flex flex-col gap-2 text-sm text-neutral-300">
          Fotos actuales
          <div className="flex flex-wrap gap-3">
            {product.image_urls.map((url) => (
              <label key={url} className="flex flex-col items-center gap-1 text-xs text-neutral-400">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-neutral-800">
                  <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <span className="flex items-center gap-1">
                  <input type="checkbox" name="remove_images" value={url} />
                  Quitar
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Agregar fotos nuevas (opcional)
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="text-sm text-neutral-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Nombre de la remera
          <input
            name="name"
            required
            defaultValue={product.name}
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Club o selección
          <input
            name="club"
            required
            defaultValue={product.club}
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Temporada (opcional)
          <input
            name="season"
            defaultValue={product.season ?? ""}
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Categoría
          <select
            name="category"
            required
            defaultValue={product.category}
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
            defaultValue={product.stock_status}
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
            defaultValue={product.price}
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Talles disponibles (separados por coma)
          <input
            name="sizes"
            defaultValue={product.sizes.join(", ")}
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
        <SubmitButton
          pendingText="Guardando..."
          className="mt-2 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
        >
          Guardar cambios
        </SubmitButton>
      </form>
    </main>
  );
}
