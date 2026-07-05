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
  const file = formData.get("image") as File;

  if (!name || !club || !category || Number.isNaN(price)) {
    redirect(`/admin/new?error=${encodeURIComponent("Completá todos los campos requeridos")}`);
  }

  if (!file || file.size === 0) {
    redirect(`/admin/new?error=${encodeURIComponent("Falta la foto de la remera")}`);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file);

  if (uploadError) {
    redirect(`/admin/new?error=${encodeURIComponent("No se pudo subir la imagen")}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("products").getPublicUrl(path);

  const { error: insertError } = await supabase.from("products").insert({
    name,
    club,
    season,
    category,
    price,
    sizes,
    image_url: publicUrl,
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
  const imageUrl = formData.get("image_url") as string;

  await supabase.from("products").delete().eq("id", id);

  const path = imageUrl?.split("/products/").pop();
  if (path) {
    await supabase.storage.from("products").remove([path]);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
