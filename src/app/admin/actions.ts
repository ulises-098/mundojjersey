"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Usuario o contraseña incorrectos")}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const name = (formData.get("name") as string)?.trim();
  const club = (formData.get("club") as string)?.trim();
  const season = ((formData.get("season") as string) || "").trim() || null;
  const category = formData.get("category") as string;
  const stockStatus = formData.get("stock_status") as string;
  const price = Number(formData.get("price"));
  const sizes = ((formData.get("sizes") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!name || !club || !category || Number.isNaN(price)) {
    redirect(`/admin/new?error=${encodeURIComponent("Completá todos los campos requeridos")}`);
  }

  if (files.length === 0) {
    redirect(`/admin/new?error=${encodeURIComponent("Falta al menos una foto de la remera")}`);
  }

  const imageUrls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (uploadError) {
      redirect(`/admin/new?error=${encodeURIComponent("No se pudo subir una de las imágenes")}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(path);

    imageUrls.push(publicUrl);
  }

  const { error: insertError } = await supabase.from("products").insert({
    name,
    club,
    season,
    category,
    stock_status: stockStatus,
    price,
    sizes,
    image_urls: imageUrls,
  });

  if (insertError) {
    redirect(`/admin/new?error=${encodeURIComponent("No se pudo guardar la remera")}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const club = (formData.get("club") as string)?.trim();
  const season = ((formData.get("season") as string) || "").trim() || null;
  const category = formData.get("category") as string;
  const stockStatus = formData.get("stock_status") as string;
  const price = Number(formData.get("price"));
  const sizes = ((formData.get("sizes") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !club || !category || Number.isNaN(price)) {
    redirect(
      `/admin/${id}/edit?error=${encodeURIComponent("Completá todos los campos requeridos")}`,
    );
  }

  const currentImageUrls = ((formData.get("current_image_urls") as string) || "")
    .split(",")
    .filter(Boolean);
  const removedImageUrls = formData.getAll("remove_images") as string[];
  const keptImageUrls = currentImageUrls.filter(
    (url) => !removedImageUrls.includes(url),
  );

  const newFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const newImageUrls: string[] = [];
  for (const file of newFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (uploadError) {
      redirect(
        `/admin/${id}/edit?error=${encodeURIComponent("No se pudo subir una de las imágenes")}`,
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(path);

    newImageUrls.push(publicUrl);
  }

  const finalImageUrls = [...keptImageUrls, ...newImageUrls];

  if (finalImageUrls.length === 0) {
    redirect(
      `/admin/${id}/edit?error=${encodeURIComponent("Debe quedar al menos una foto")}`,
    );
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      name,
      club,
      season,
      category,
      stock_status: stockStatus,
      price,
      sizes,
      image_urls: finalImageUrls,
    })
    .eq("id", id);

  if (updateError) {
    redirect(
      `/admin/${id}/edit?error=${encodeURIComponent("No se pudo guardar los cambios")}`,
    );
  }

  const removedPaths = removedImageUrls
    .map((url) => url.split("/products/").pop())
    .filter((p): p is string => !!p);

  if (removedPaths.length > 0) {
    await supabase.storage.from("products").remove(removedPaths);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const id = formData.get("id") as string;
  const imageUrls = (formData.get("image_urls") as string)
    ?.split(",")
    .filter(Boolean);

  await supabase.from("products").delete().eq("id", id);

  const paths = (imageUrls || [])
    .map((url) => url.split("/products/").pop())
    .filter((p): p is string => !!p);

  if (paths.length > 0) {
    await supabase.storage.from("products").remove(paths);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
