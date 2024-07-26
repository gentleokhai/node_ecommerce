export enum ItemStatus {
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

export interface Item {
  item: string;
  numberOfItems: number;
  status?: ItemStatus;
}

export interface CreateTransaction {
  customerId?: string;
  items: Item[];
  methodOfPayment: string;
  typeOfTransaction: 'SALE' | 'REFUND';
  cashierId: string;
}

export interface RefundTransaction {
  items: Item[];
  typeOfTransaction: 'SALE' | 'REFUND';
}
