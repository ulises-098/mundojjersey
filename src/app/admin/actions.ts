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
