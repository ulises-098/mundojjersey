import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { Product, ProductCategory, StockStatus } from "@/types/product";

const CATEGORY_TABS: { label: string; value: ProductCategory | "todas" }[] = [
  { label: "Todas", value: "todas" },
  { label: "Versión Retro", value: "retro" },
  { label: "Versión Jugador", value: "jugador" },
];

const STOCK_TABS: { label: string; value: StockStatus | "todas" }[] = [
  { label: "Todas", value: "todas" },
  { label: "En stock", value: "stock" },
  { label: "Por encargue", value: "encargue" },
];

function buildHref(
  current: { categoria?: string; stock?: string },
  key: "categoria" | "stock",
  value: string,
) {
  const params = new URLSearchParams();
  const next = { ...current, [key]: value };
  if (next.categoria && next.categoria !== "todas") {
    params.set("categoria", next.categoria);
  }
  if (next.stock && next.stock !== "todas") {
    params.set("stock", next.stock);
  }
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; stock?: string }>;
}) {
  const { categoria, stock } = await searchParams;
  const activeCategory: ProductCategory | "todas" =
    categoria === "retro" || categoria === "jugador" ? categoria : "todas";
  const activeStock: StockStatus | "todas" =
    stock === "stock" || stock === "encargue" ? stock : "todas";

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeCategory !== "todas") {
    query = query.eq("category", activeCategory);
  }
  if (activeStock !== "todas") {
    query = query.eq("stock_status", activeStock);
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

      <div className="mb-4 flex justify-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const href = buildHref({ categoria, stock }, "categoria", tab.value);
          const isActive = activeCategory === tab.value;
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

      <div className="mb-8 flex justify-center gap-2">
        {STOCK_TABS.map((tab) => {
          const href = buildHref({ categoria, stock }, "stock", tab.value);
          const isActive = activeStock === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-white text-neutral-900"
                  : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700"
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
