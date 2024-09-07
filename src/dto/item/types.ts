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

export type CreateItemService = {
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
  company: string;
};

export type UpdateItem = {
  image: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: number;
  description: string;
};

export type UpdateItemPrice = {
  costPrice: number;
  sellingPrice: number;
};

export type UpdateItemStock = {
  stock: number;
  lowStock: number;
};

export interface FilterTypes {
  inventory?: { $in: string[] };
  status?: { $in: string[] };
  keyword?: string;
  archived?: boolean;
  company?: string;
}

export interface RestockPayload {
  items: {
    item: string;
    numberOfItems: number;
  }[];
}
