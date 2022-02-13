import { FiltersList } from '../models/types';

export const filters: FiltersList = {
    // contains: (item, text) => item.toLowerCase().includes(text.toLowerCase()),
    eq: (item: unknown, value: unknown) => item === value,
    eqi: (item: unknown, value: unknown) => (typeof item === 'string' && typeof value === 'string') ? item.toLowerCase() === value.toLowerCase() : item === value,
    gt: (item, value) => item > value,
    gte: (item, value) => item > value,
    // in: (item, arr) => arr.some((elem) => elem === item),
    lt: (item, value) => item < value,
    lte: (item, value) => item <= value,
    ne: (item, value) => item !== value,
    // nin: (item, arr) => arr.every((elem) => elem !== item)
};
