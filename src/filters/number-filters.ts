import { NumberFiltersList } from '../models/types';

const getNumberOfValue = (value: unknown): number | undefined => {
    if (typeof value === 'number') {
        return value as number;
    }

    if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
    }

    return undefined;
}

const gt = (entryValue: unknown, reference: unknown): boolean => {
    let entryValueCoerced = getNumberOfValue(entryValue);
    let referenceCoerced = getNumberOfValue(reference);

    if (entryValueCoerced === undefined || referenceCoerced === undefined) {
        return false;
    }

    return entryValueCoerced > referenceCoerced;
};

const gte = (entryValue: unknown, reference: unknown): boolean => {
    let entryValueCoerced = getNumberOfValue(entryValue);
    let referenceCoerced = getNumberOfValue(reference);

    if (entryValueCoerced === undefined || referenceCoerced === undefined) {
        return false;
    }

    return entryValueCoerced >= referenceCoerced;
};

const lt = (entryValue: unknown, reference: unknown): boolean => {
    let entryValueCoerced = getNumberOfValue(entryValue);
    let referenceCoerced = getNumberOfValue(reference);

    if (entryValueCoerced === undefined || referenceCoerced === undefined) {
        return false;
    }

    return entryValueCoerced < referenceCoerced;
};

const lte = (entryValue: unknown, reference: unknown): boolean => {
    let entryValueCoerced = getNumberOfValue(entryValue);
    let referenceCoerced = getNumberOfValue(reference);

    if (entryValueCoerced === undefined || referenceCoerced === undefined) {
        return false;
    }

    return entryValueCoerced <= referenceCoerced;
};

export const numberFilters: NumberFiltersList = {
    gt, gte, lt, lte
};
