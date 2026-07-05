"use client";

import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductForm({
  id,
  imageUrls,
}: {
  id: string;
  imageUrls: string[];
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (
          !confirm(
            "¿Seguro que querés eliminar esta remera? Esta acción no se puede deshacer.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="image_urls" value={imageUrls.join(",")} />
      <button className="text-xs font-semibold text-red-400 hover:text-red-300">
        Eliminar
      </button>
    </form>
  );
}
