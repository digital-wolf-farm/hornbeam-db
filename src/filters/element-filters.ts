import { FiltersList } from '../models/types';

export const elementFilters: any = {
    exist: (entryValue: unknown, reference: unknown) => (typeof reference === 'boolean') ? !!entryValue === reference : false,
};
