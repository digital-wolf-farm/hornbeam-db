import { BasicFiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const exist = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isBoolean(reference)) {
        return false;
    }

    return reference ? entryValue != null : entryValue == null;
};

const eq = (entryValue: unknown, reference: unknown): boolean => {
    if (
        (typesValidators.isNumber(entryValue) && typesValidators.isString(reference)) ||
        (typesValidators.isString(entryValue) && typesValidators.isNumber(reference))
    ) {
        return String(entryValue) === String(reference);
    }

    return entryValue === reference;
};

const eqi = (entryValue: unknown, reference: unknown): boolean => {
    if (typesValidators.isString(entryValue) && typesValidators.isString(reference)) {
        return eq((entryValue as string).toLowerCase(), (reference as string).toLowerCase());
    }

    return eq(entryValue, reference);
};

const neq = (entryValue: unknown, reference: unknown): boolean => {
    return !eq(entryValue, reference);
};

const neqi = (entryValue: unknown, reference: unknown): boolean => {
    if (typesValidators.isString(entryValue) && typesValidators.isString(reference)) {
        return neq((entryValue as string).toLowerCase(), (reference as string).toLowerCase());
    }

    return neq(entryValue, reference);
};

export const basicFilters: BasicFiltersList = {
    exist, eq, eqi, neq, neqi
};
