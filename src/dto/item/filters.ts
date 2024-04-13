import { Request } from 'express';
import { FilterTypes } from './types';

export const getItemsFilter = (req: Request) => {
  const status = req.query.status as string | string[];
  const inventory = req.query.inventory as string | string[];
  const keyword = req.query.keyword as string;
  const sort = req.query.sort as string;

  const filter: FilterTypes = {};
  if (status && status !== '') {
    const employeesStatus = Array.isArray(status) ? status : [status];
    filter.status = { $in: employeesStatus };
  }

  if (inventory && inventory !== '') {
    const itemInventory = Array.isArray(inventory) ? inventory : [inventory];
    filter.inventory = { $in: itemInventory };
  }

  let sortOptions: { [key: string]: any } = {};

  if (sort) {
    const [sortField, sortOrderString] = sort.split(':');
    if (sortField === 'createdAt') {
      const sortOrder: number = sortOrderString === 'desc' ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else if (sortField === 'name') {
      const sortOrder: string = sortOrderString === 'desc' ? 'desc' : 'asc';
      sortOptions[sortField] = sortOrder;
    }
  } else {
    sortOptions['createdAt'] = -1;
  }

  let keywordQuery = {};
  if (keyword) {
    const keywords = keyword.split(' ').filter(Boolean);
    keywordQuery = {
      $or: keywords.map((keyword) => ({
        $or: [{ name: { $regex: keyword, $options: 'i' } }],
      })),
    };
  }

  const query = {
    ...filter,
    ...keywordQuery,
  };

  return { query, sortOptions };
};
