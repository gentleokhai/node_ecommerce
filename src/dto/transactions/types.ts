interface Item {
  item: string;
  numberOfItems: number;
}

export interface CreateTransaction {
  customerId: string;
  items: Item[];
  methodOfPayment: string;
  typeOfTransaction: 'SALE' | 'REFUND';
  cashierId: string;
  amount: string;
}

export interface RefundTransaction {
  customerId: string;
  items: Item[];
  typeOfTransaction: 'SALE' | 'REFUND';
  amount: string;
}
