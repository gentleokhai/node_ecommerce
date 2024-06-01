"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomersFilter = void 0;
const getCustomersFilter = (req) => {
    const keyword = req.query.keyword;
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
    const query = Object.assign({}, keywordQuery);
    return { query };
};
exports.getCustomersFilter = getCustomersFilter;
