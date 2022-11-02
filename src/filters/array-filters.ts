import { typesValidators } from '../validators/types-validators';

const all = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isArray(entryValue) || !typesValidators.isArray(reference) || !(reference as Array<unknown>).every((elem) => typesValidators.isPrimitive(elem))) {
        return false;
    }

    return (reference as Array<unknown>).every((elem) => (reference as Array<unknown>).includes(elem));
};

const contain = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isArray(entryValue) || !typesValidators.isPrimitive(reference)) {
        return false;
    }

    return (entryValue as Array<unknown>).some((elem) => {
        if (typesValidators.isPrimitive(elem)) {
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
    if (!typesValidators.isArray(entryValue) || !typesValidators.isNumber(reference)) {
        return false;
    }

    return (entryValue as Array<unknown>).length === reference;
};

export const arrayFilters: any = {
    all,
    size,
    contain
};