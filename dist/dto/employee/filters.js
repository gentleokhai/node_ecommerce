"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeesFilter = void 0;
const getEmployeesFilter = (req) => {
    const status = req.query.status;
    const accessType = req.query.accessType;
    const keyword = req.query.keyword;
    const sort = req.query.sort;
    const filter = {};
    if (status && status !== '') {
        const employeesStatus = Array.isArray(status) ? status : [status];
        filter.status = { $in: employeesStatus };
    }
    if (accessType && accessType !== '') {
        const accessTypes = Array.isArray(accessType) ? accessType : [accessType];
        filter.accessType = { $in: accessTypes };
    }
    let sortOptions = {};
    if (sort) {
        const [sortField, sortOrderString] = sort.split(':');
        if (sortField === 'createdAt') {
            const sortOrder = sortOrderString === 'desc' ? -1 : 1;
            sortOptions[sortField] = sortOrder;
        }
        else if (sortField === 'firstName') {
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
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                ],
            })),
        };
    }
    const query = Object.assign(Object.assign({}, filter), keywordQuery);
    return { query, sortOptions };
};
exports.getEmployeesFilter = getEmployeesFilter;
