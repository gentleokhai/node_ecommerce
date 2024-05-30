interface Item {
  itemId: string;
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
