export type CreateItem = {
  image?: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: number | null;
  description: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number | null;
  quantityInPack: number | null;
  stock: number;
  lowStock: number;
};

export type CreateUploadedItem = {
  image: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  costPrice: string;
  sellingPrice: string;
  wholesalePrice: string;
  stock: string;
  lowStock: string;
};

export type CreateUploadPayload = {
  items: CreateUploadedItem[]
}

export type CreateItemService = {
  image?: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  weight: number | null;
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

export type UploadItem = {
  image: string;
  name: string;
  category: string;
  unit: string;
  sku: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  lowStock: string;
  wholesalePrice: string;
};
