import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { Product, ProductCategory, StockStatus } from "@/types/product";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; stock?: string; q?: string }>;
}) {
  const { categoria, stock, q } = await searchParams;
  const activeCategory: ProductCategory | "todas" =
    categoria === "retro" || categoria === "jugador" ? categoria : "todas";
  const activeStock: StockStatus | "todas" =
    stock === "stock" || stock === "encargue" ? stock : "todas";
  const activeSearch = (q || "").trim();

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
  if (activeSearch) {
    const safeSearch = activeSearch.replace(/[,()%_]/g, "");
    query = query.or(`name.ilike.%${safeSearch}%,club.ilike.%${safeSearch}%`);
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

      <CatalogFilters categoria={activeCategory} stock={activeStock} q={activeSearch} />

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500">
          No encontramos remeras con esos filtros.
        </p>
      )}
    </main>
  );
}
