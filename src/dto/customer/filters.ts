import { Request } from 'express';

export const getCustomersFilter = (req: Request) => {
  const keyword = req.query.keyword as string;

  let keywordQuery = {};
  if (keyword) {
    const keywords = keyword.split(' ').filter(Boolean);
    keywordQuery = {
      $or: keywords.map((keyword) => ({
        $or: [
          { firstName: { $regex: keyword, $options: 'i' } },
          { lastName: { $regex: keyword, $options: 'i' } },
        ],
      })),
    };
  }

  const query = {
    ...keywordQuery,
  };

  return { query };
};
