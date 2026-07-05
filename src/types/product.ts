export type ProductCategory = "retro" | "jugador";
export type StockStatus = "stock" | "encargue";
export type GarmentType = "remera" | "short" | "campera" | "conjunto";

export const GARMENT_LABELS: Record<GarmentType, string> = {
  remera: "Remera",
  short: "Short",
  campera: "Campera",
  conjunto: "Conjunto",
};

export interface Product {
  id: string;
  name: string;
  club: string;
  season: string | null;
  category: ProductCategory;
  stock_status: StockStatus;
  garment_type: GarmentType | null;
  price: number;
  sizes: string[];
  image_urls: string[];
  created_at: string;
}
