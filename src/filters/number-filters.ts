import { NumberFiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const gt = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isNumber(entryValue) || !typesValidators.isNumber(reference)) {
        return false;
    }

    return entryValue > reference;
};

const gte = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isNumber(entryValue) || !typesValidators.isNumber(reference)) {
        return false;
    }

    return entryValue >= reference;
};

const lt = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isNumber(entryValue) || !typesValidators.isNumber(reference)) {
        return false;
    }

    return entryValue < reference;
};

const lte = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isNumber(entryValue) || !typesValidators.isNumber(reference)) {
        return false;
    }

    return entryValue <= reference;
};

export const numberFilters: NumberFiltersList = {
    gt, gte, lt, lte
};
