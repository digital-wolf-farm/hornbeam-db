import { ArrayFiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const all = (entryValue: unknown, reference: unknown): boolean => {
    if (
        !typesValidators.isArray(entryValue) ||
        !(entryValue as Array<unknown>).every((elem) => typesValidators.isNumber(elem) || typesValidators.isString(elem)) ||
        !typesValidators.isArray(reference) ||
        !(reference as Array<unknown>).every((elem) => typesValidators.isNumber(elem) || typesValidators.isString(elem))
    ) {
        return false;
    }

    return (reference as Array<unknown>).every((elem) => (entryValue as Array<unknown>).includes(elem));
};

const contain = (entryValue: unknown, reference: unknown): boolean => {
    if (
        !typesValidators.isArray(entryValue) ||
        !(typesValidators.isNumber(reference) || typesValidators.isString(reference))
    ) {
        return false;
    }

    return (entryValue as Array<unknown>).some((elem) => {
        if (typesValidators.isNumber(elem) || typesValidators.isString(elem)) {
            return elem === reference;
        } else if (typesValidators.isArray(elem)) {
            // Only 2D array is handled
            return (elem as Array<unknown>).includes(reference);
        } else if (typesValidators.isObject(elem)) {
            return Object.values(elem).includes(reference);
        } else {
            return false;
        }
    });
};

const size = (entryValue: unknown, reference: unknown): boolean => {
    if (
        !typesValidators.isArray(entryValue) ||
        !(typesValidators.isPositiveInteger(reference) || reference === 0)
    ) {
        return false;
    }

    return (entryValue as Array<unknown>).length === reference;
};

export const arrayFilters: ArrayFiltersList = {
    all,
    size,
    contain
};