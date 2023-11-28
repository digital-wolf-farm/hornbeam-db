import { ArrayFiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const isArrayOfStringsOrNumbers = (value: unknown): boolean => {
    if (!Array.isArray(value)) {
        return false;
    }

    if (!(value as Array<unknown>).every((elem) => typeof elem === 'number' || typeof elem === 'string')) {
        return false;
    }

    return true;
};

const all = (entryValue: unknown, reference: unknown): boolean => {
    if (!isArrayOfStringsOrNumbers(entryValue) || !isArrayOfStringsOrNumbers(reference)) {
        return false;
    }

    return (reference as Array<unknown>).every((refElem) => (entryValue as Array<unknown>).some((entryElem) => String(entryElem).toLowerCase() === String(refElem).toLowerCase()));
};

const part = (entryValue: unknown, reference: unknown): boolean => {
    if (!isArrayOfStringsOrNumbers(entryValue) || !isArrayOfStringsOrNumbers(reference)) {
        return false;
    }

    return (reference as Array<unknown>).some((refElem) => (entryValue as Array<unknown>).some((entryElem) => String(entryElem).toLowerCase() === String(refElem).toLowerCase()));
};

const size = (entryValue: unknown, reference: unknown): boolean => {
    if (!Array.isArray(entryValue)) {
        return false;
    }

    if (!(typesValidators.isPositiveInteger(reference) || reference === 0)) {
        return false;
    }

    return (entryValue as Array<unknown>).length === reference;
};

export const arrayFilters: ArrayFiltersList = {
    all,
    part,
    size
};
