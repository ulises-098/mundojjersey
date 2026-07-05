"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product, GARMENT_LABELS } from "@/types/product";
import { buildWhatsAppLink } from "@/lib/config";
import { WhatsAppIcon } from "./WhatsAppIcon";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductLightbox({
  product,
  images,
  initialIndex,
  onClose,
}: {
  product: Product;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const hasMultipleImages = images.length > 1;

  function goTo(newIndex: number) {
    setIndex((newIndex + images.length) % images.length);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % images.length);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95" onClick={onClose}>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 text-3xl leading-none text-white/80 hover:text-white"
      >
        ×
      </button>

      <div
        className="relative min-h-0 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={product.name}
          fill
          className="object-contain"
          sizes="100vw"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-2xl text-white hover:bg-black/70 sm:left-6"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-2xl text-white hover:bg-black/70 sm:right-6"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className="w-full shrink-0 border-t border-white/10 bg-[#101a2c] px-4 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex max-w-xl flex-col gap-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            <span className="text-blue-300">
              {product.category === "retro" ? "Retro" : "Jugador"}
            </span>
            {" · "}
            <span
              className={
                product.stock_status === "stock" ? "text-emerald-400" : "text-amber-400"
              }
            >
              {product.stock_status === "stock" ? "En stock" : "Por encargue"}
            </span>
            {product.garment_type && (
              <>
                {" · "}
                <span className="text-neutral-400">{GARMENT_LABELS[product.garment_type]}</span>
              </>
            )}
          </p>
          <h2 className="font-semibold text-white">{product.name}</h2>
          <p className="text-sm text-neutral-400">
            {product.club}
            {product.season ? ` · ${product.season}` : ""}
          </p>
          {product.sizes?.length > 0 && (
            <p className="text-xs text-neutral-500">Talles: {product.sizes.join(", ")}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-bold text-white">
              {currencyFormatter.format(product.price)}
            </span>
            <a
              href={buildWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
