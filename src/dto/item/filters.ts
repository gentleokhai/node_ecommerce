// import { Request } from 'express';
// import { FilterTypes } from './types';

// export const getItemsFilter = (req: Request) => {
//   const active = req.query.status as string;
//   const inventory = req.query.inventory as string | string[];
//   const category = req.query.category as string | string[]; // Add category filter
//   const keyword = req.query.keyword as string;
//   const sort = req.query.sort as string;

//   const filter: FilterTypes = {};

//   // Status filter
//   if (active) {
//     const employeesStatus = active.split(',').map((s) => s.trim());
//     filter.status = { $in: employeesStatus };
//   }

//   // Inventory filter
//   if (inventory && inventory !== '') {
//     const itemInventory = Array.isArray(inventory) ? inventory : [inventory];
//     filter.inventory = { $in: itemInventory };
//   }

//   // Category filter
//   if (category && category !== '') {
//     const itemCategories = Array.isArray(category) ? category : [category];
//     filter.category = { $in: itemCategories };
//   }

//   // Sorting options
//   let sortOptions: { [key: string]: any } = {};
//   if (sort) {
//     const [sortField, sortOrderString] = sort.split(':');
//     const sortOrder = sortOrderString === 'desc' ? -1 : 1;
//     sortOptions[sortField] = sortOrder;
//   } else {
//     sortOptions['createdAt'] = -1;
//   }

//   // Keyword search
//   let keywordQuery = {};
//   if (keyword) {
//     const keywords = keyword.split(' ').filter(Boolean);
//     keywordQuery = {
//       $or: keywords.map((keyword) => ({
//         $or: [{ name: { $regex: keyword, $options: 'i' } }],
//       })),
//     };
//   }

//   // Combine filters and keyword query
//   const query = {
//     ...filter,
//     ...keywordQuery,
//   };

//   return { query, sortOptions };
// };








import { Request } from 'express';
import { FilterTypes } from './types';

export const getItemsFilter = (req: Request) => {
  const active = req.query.status as string;
  const inventory = req.query.inventory as string | string[];
  const category = req.query.category as string | string[];
  const keyword = req.query.keyword as string;
  const sort = req.query.sort as string;

  const filter: FilterTypes = {};

  // Status filter
  if (active) {
    const employeesStatus = active.split(',').map((s) => s.trim());
    filter.status = { $in: employeesStatus };
    console.log('Status filter applied:', filter.status);
  }

  // Inventory filter
  if (inventory && inventory !== '') {
    const itemInventory = Array.isArray(inventory) ? inventory : [inventory];
    filter.inventory = { $in: itemInventory };
    console.log('Inventory filter applied:', filter.inventory);
  }

  // Category filter
  if (category && category !== '') {
    const itemCategories = Array.isArray(category) ? category : [category];
    filter.category = { $in: itemCategories };
    console.log('Category filter applied:', filter.category);
  }

  // Sorting options
  let sortOptions: { [key: string]: any } = {};
  if (sort) {
    const [sortField, sortOrderString] = sort.split(':');
    const sortOrder = sortOrderString === 'desc' ? -1 : 1;
    sortOptions[sortField] = sortOrder;
    console.log('Sort applied:', sortField, sortOrder === -1 ? 'desc' : 'asc');
  } else {
    sortOptions['createdAt'] = -1;
    console.log('Default sort applied: createdAt desc');
  }

  // Keyword search
  let keywordQuery = {};
  if (keyword) {
    const keywords = keyword.split(' ').filter(Boolean);
    keywordQuery = {
      $or: keywords.map((word) => ({
        name: { $regex: word, $options: 'i' },
      })),
    };
    console.log('Keyword search applied:', keywordQuery);
  }

  // Combine filters and keyword query
  const query = {
    ...filter,
    ...keywordQuery,
  };

  // Final log of combined query and sort options
  console.log('Final Query:', JSON.stringify(query, null, 2));
  console.log('Final Sort Options:', JSON.stringify(sortOptions, null, 2));

  return { query, sortOptions };
};
