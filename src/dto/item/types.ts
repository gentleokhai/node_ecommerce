export type CreateItem = {
  image?: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: string;
  currency: string;
  description: string;
  costPrice: string;
  sellingPrice: string;
  wholesalePrice: string;
  quantityInPack: string;
  stock: string;
  lowStock: string;
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
