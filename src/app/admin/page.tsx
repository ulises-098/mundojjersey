import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, logout } from "./actions";
import { Product } from "@/types/product";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Panel de administración</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
          >
            + Nueva remera
          </Link>
          <form action={logout}>
            <button className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-700">
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(products as Product[] | null)?.map((product) => (
          <div
            key={product.id}
            className="flex gap-4 rounded-xl border border-white/10 bg-neutral-900 p-3"
          >
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
              <Image
                src={product.image_urls[0]}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="text-xs text-neutral-400">{product.club}</p>
                <p className="text-xs uppercase text-blue-400">
                  {product.category}
                </p>
                <p className="text-xs text-neutral-500">
                  {product.stock_status === "stock" ? "En stock" : "Por encargue"}
                </p>
              </div>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={product.id} />
                <input
                  type="hidden"
                  name="image_urls"
                  value={product.image_urls.join(",")}
                />
                <button className="mt-2 text-xs font-semibold text-red-400 hover:text-red-300">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <p className="mt-10 text-center text-neutral-500">
          No hay remeras cargadas todavía.
        </p>
      )}
    </main>
  );
}
