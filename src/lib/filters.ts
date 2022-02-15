import { FiltersList } from '../models/types';

export const filters: FiltersList = {
    eq: (entryValue: unknown, reference: unknown) => entryValue === reference,
    eqi: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'string' && typeof reference === 'string') ? entryValue.toLowerCase() === reference.toLowerCase() : entryValue === reference,
    neq: (entryValue: unknown, reference: unknown) => entryValue !== reference,
    neqi: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'string' && typeof reference === 'string') ? entryValue.toLowerCase() !== reference.toLowerCase() : entryValue !== reference,
    gt: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'number' && typeof reference === 'number') ? entryValue > reference : false,
    gte: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'number' && typeof reference === 'number') ? entryValue >= reference : false,
    lt: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'number' && typeof reference === 'number') ? entryValue < reference : false,
    lte: (entryValue: unknown, reference: unknown) => (typeof entryValue === 'number' && typeof reference === 'number') ? entryValue <= reference : false,
    exist: (entryValue: unknown, reference: unknown) => (typeof reference === 'boolean') ? !!entryValue === reference : false,
};
