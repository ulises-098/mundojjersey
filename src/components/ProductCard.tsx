"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { buildWhatsAppLink } from "@/lib/config";
import { ProductLightbox } from "./ProductLightbox";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const SWIPE_THRESHOLD = 40;

export function ProductCard({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = product.image_urls;
  const hasMultipleImages = images.length > 1;

  function goTo(newIndex: number) {
    setIndex((newIndex + images.length) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      goTo(deltaX > 0 ? index - 1 : index + 1);
    }
    setTouchStartX(null);
  }

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-transform hover:-translate-y-1 hover:border-emerald-500/40">
        <div
          className="relative aspect-4/5 w-full cursor-zoom-in overflow-hidden bg-neutral-800"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[index]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              {product.category === "retro" ? "Retro" : "Jugador"}
            </span>
            <span
              className={`rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                product.stock_status === "stock" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {product.stock_status === "stock" ? "En stock" : "Por encargue"}
            </span>
          </div>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(index - 1);
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(index + 1);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === index ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
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

      {lightboxOpen && (
        <ProductLightbox
          images={images}
          initialIndex={index}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
