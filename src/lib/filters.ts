export const filters = {
    contains: (item, text) => item.toLowerCase().includes(text.toLowerCase()),
    eq: (item, value) => item === value,
    gt: (item, value) => item > value,
    gte: (item, value) => item > value,
    in: (item, arr) => arr.some((elem) => elem === item),
    lt: (item, value) => item < value,
    lte: (item, value) => item <= value,
    ne: (item, value) => item !== value,
    nin: (item, arr) => arr.every((elem) => elem !== item)
    // find by regex
    // find by defined / undefined value
    // dates comparison - check if gt, lt eq is working
    // find by geospatial data
    // find by any of this filter inside array - MongoDB - $elemMatch + array size
    // add diferent version of filters for strings (with lowercase) and for numbers, bigint and booleans or add sth like $text from MongoDB
};
