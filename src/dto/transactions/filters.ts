import { Request } from 'express';
import { TransactionFilter } from './types';

export const getTransactionFilter = (req: Request): { query: any, sort: any } => {
  // Extracting query parameters from the request
  const paymentMethod = req.query.paymentMethod as string | undefined;
  const staff = req.query.staff as string | undefined;
  const customerType = req.query.customerType as 'SALE' | 'REFUND' | undefined;
  const keyword = req.query.keyword as string | undefined;
  const status = req.query.status ? (req.query.status as string).split(',').map((s) => s.trim()) : [];

  // Sorting parameters
  const sortBy = req.query.sortBy ? (req.query.sortBy as string).split(',') : ['createdAt'];  // Handling multiple fields
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;  // Default to ascending order

  // Initialize filters array to collect filter conditions
  const filterConditions: any[] = [];

  // Debugging log for query parameters
  console.log('Query Parameters:', {
    paymentMethod,
    staff,
    customerType,
    keyword,
    status,
    sortBy,
    sortOrder,
  });

  // Applying Payment Method filter
  if (paymentMethod) {
    filterConditions.push({ methodOfPayment: paymentMethod });
    console.log('Payment Method filter applied:', { methodOfPayment: paymentMethod });
  }

  // Applying Staff filter
  if (staff) {
    filterConditions.push({ 'cashier.id': staff });
    console.log('Staff filter applied:', { 'cashier.id': staff });
  }

  // Applying Customer Type filter (SALE or REFUND)
  if (customerType) {
    filterConditions.push({ typeOfTransaction: customerType });
    console.log('Customer Type filter applied:', { typeOfTransaction: customerType });
  }

  // Applying Status filter (array of statuses)
  if (status.length) {
    filterConditions.push({ 'items.status': { $in: status } });
    console.log('Status filter applied:', { 'items.status': { $in: status } });
  }

  // Applying Keyword search (for partial match in 'customers.firstName' or 'cashier.firstName')
  if (keyword) {
    const keywords = keyword.split(' ').filter(Boolean);
    const keywordQuery = {
      $or: keywords.map((word) => ({
        $or: [
          { 'customer.firstName': { $regex: word, $options: 'i' } }, // Adjusted field to customer.firstName
          { 'cashier.firstName': { $regex: word, $options: 'i' } },
        ],
      })),
    };
    filterConditions.push(keywordQuery);
    console.log('Keyword search applied:', keywordQuery);
  }

  // Combine all filters into a single query using $and for multiple conditions
  const query = filterConditions.length > 0 ? { $and: filterConditions } : {};
  console.log('Final Query:', JSON.stringify(query, null, 2));

  // Determine sorting conditions (support multiple sortBy fields)
  const sort: any = {};
  sortBy.forEach(field => {
    sort[field] = sortOrder;  // Apply sort order for each field in the array
    console.log(`Sorting applied: ${field} ${sortOrder === 1 ? 'asc' : 'desc'}`);
  });

  // Final log of the combined query and sorting for debugging purposes
  console.log('Final Sort:', JSON.stringify(sort, null, 2));

  return { query, sort };
};
