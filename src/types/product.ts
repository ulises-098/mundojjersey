export type ProductCategory = "retro" | "jugador";
export type StockStatus = "stock" | "encargue";

export interface Product {
  id: string;
  name: string;
  club: string;
  season: string | null;
  category: ProductCategory;
  stock_status: StockStatus;
  price: number;
  sizes: string[];
  image_urls: string[];
  created_at: string;
}
