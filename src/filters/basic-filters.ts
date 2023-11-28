import { BasicFiltersList } from '../models/types';

const exist = (entryValue: unknown, reference: unknown): boolean => {
    if (typeof reference !== 'boolean') {
        return false;
    }

    return reference ? entryValue != null : entryValue == null;
};

const eq = (entryValue: unknown, reference: unknown): boolean => {
    if (
        (typeof entryValue === 'number' && typeof reference === 'string') ||
        (typeof entryValue === 'string' && typeof reference === 'number')
    ) {
        return String(entryValue) === String(reference);
    }

    return entryValue === reference;
};

const eqi = (entryValue: unknown, reference: unknown): boolean => {
    if (typeof entryValue === 'string' && typeof reference === 'string') {
        return eq((entryValue as string).toLowerCase(), (reference as string).toLowerCase());
    }

    return eq(entryValue, reference);
};

const neq = (entryValue: unknown, reference: unknown): boolean => {
    return !eq(entryValue, reference);
};

const neqi = (entryValue: unknown, reference: unknown): boolean => {
    if (typeof entryValue === 'string' && typeof reference === 'string') {
        return neq((entryValue as string).toLowerCase(), (reference as string).toLowerCase());
    }

    return neq(entryValue, reference);
};

export const basicFilters: BasicFiltersList = {
    exist, eq, eqi, neq, neqi
};
