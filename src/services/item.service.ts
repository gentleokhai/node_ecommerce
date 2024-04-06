import { CreateItem } from '../dto/item';
import { Item } from '../models/items.model';

export const createItem = async (data: CreateItem) => {
  const createdUser = await Item.create(data);

  return createdUser;
};
