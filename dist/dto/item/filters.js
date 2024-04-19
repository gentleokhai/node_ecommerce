"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemsFilter = void 0;
const getItemsFilter = (req) => {
    const status = req.query.status;
    const inventory = req.query.inventory;
    const keyword = req.query.keyword;
    const sort = req.query.sort;
    const filter = {};
    if (status && status !== '') {
        const employeesStatus = Array.isArray(status) ? status : [status];
        filter.status = { $in: employeesStatus };
    }
    if (inventory && inventory !== '') {
        const itemInventory = Array.isArray(inventory) ? inventory : [inventory];
        filter.inventory = { $in: itemInventory };
    }
    let sortOptions = {};
    if (sort) {
        const [sortField, sortOrderString] = sort.split(':');
        if (sortField === 'createdAt') {
            const sortOrder = sortOrderString === 'desc' ? -1 : 1;
            sortOptions[sortField] = sortOrder;
        }
        else if (sortField === 'name') {
            const sortOrder = sortOrderString === 'desc' ? 'desc' : 'asc';
            sortOptions[sortField] = sortOrder;
        }
    }
    else {
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
    const query = Object.assign(Object.assign({}, filter), keywordQuery);
    return { query, sortOptions };
};
exports.getItemsFilter = getItemsFilter;
