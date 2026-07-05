import Image from "next/image";
import { Product } from "@/types/product";
import { buildWhatsAppLink } from "@/lib/config";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-transform hover:-translate-y-1 hover:border-emerald-500/40">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-800">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
          {product.category === "retro" ? "Retro" : "Jugador"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="text-sm text-neutral-400">
          {product.club}
          {product.season ? ` · ${product.season}` : ""}
        </p>
        {product.sizes?.length > 0 && (
          <p className="text-xs text-neutral-500">Talles: {product.sizes.join(", ")}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-white">
            {currencyFormatter.format(product.price)}
          </span>
          <a
            href={buildWhatsAppLink(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
