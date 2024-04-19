export type CreateItem = {
  image?: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: number | null;
  currency: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number | null;
  quantityInPack: number | null;
  stock: number;
  lowStock: number;
};

export type UpdateItemPrice = {
  costPrice: string;
  sellingPrice: string;
};

export type UpdateItemStock = {
  stock: string;
  lowStock: string;
};

export interface FilterTypes {
  inventory?: { $in: string[] };
  status?: { $in: string[] };
  keyword?: string;
}
