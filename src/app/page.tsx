import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { Product, ProductCategory } from "@/types/product";

const TABS: { label: string; value: ProductCategory | "todas" }[] = [
  { label: "Todas", value: "todas" },
  { label: "Versión Retro", value: "retro" },
  { label: "Versión Jugador", value: "jugador" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const active: ProductCategory | "todas" =
    categoria === "retro" || categoria === "jugador" ? categoria : "todas";

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (active !== "todas") {
    query = query.eq("category", active);
  }

  const { data: products } = await query;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Catálogo de Remeras
        </h1>
        <p className="mt-2 text-neutral-400">
          Encontrá tu camiseta y consultanos directo por WhatsApp.
        </p>
      </section>

      <div className="mb-8 flex justify-center gap-2">
        {TABS.map((tab) => {
          const href = tab.value === "todas" ? "/" : `/?categoria=${tab.value}`;
          const isActive = active === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500">
          Todavía no hay remeras cargadas en esta categoría.
        </p>
      )}
    </main>
  );
}
