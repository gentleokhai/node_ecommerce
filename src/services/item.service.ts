import { CreateItemService } from '../dto/item';
import { Item } from '../models/items.model';

export const createItem = async (data: CreateItemService) => {
  const createdUser = await Item.create(data);

  return createdUser;
};
