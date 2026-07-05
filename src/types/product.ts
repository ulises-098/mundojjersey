export type ProductCategory = "retro" | "jugador";

export interface Product {
  id: string;
  name: string;
  club: string;
  season: string | null;
  category: ProductCategory;
  price: number;
  sizes: string[];
  image_urls: string[];
  created_at: string;
}
