import { FiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const exist = (entryValue: unknown, reference: unknown): boolean => {
    return entryValue != null;
};

const eq = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isPrimitive(entryValue) || !typesValidators.isPrimitive(reference)) {
        return false;
    }

    return entryValue === reference;
};

const eqi = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isPrimitive(entryValue) || !typesValidators.isPrimitive(reference)) {
        return false;
    }

    if (typesValidators.isString(entryValue) && typesValidators.isString(reference)) {
        return (entryValue as string).toLowerCase() === (reference as string).toLowerCase();
    }

    return entryValue === reference;
};

const neq = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isPrimitive(entryValue) || !typesValidators.isPrimitive(reference)) {
        return false;
    }

    return entryValue !== reference;
};

const neqi = (entryValue: unknown, reference: unknown): boolean => {
    if (!typesValidators.isPrimitive(entryValue) || !typesValidators.isPrimitive(reference)) {
        return false;
    }

    if (typesValidators.isString(entryValue) && typesValidators.isString(reference)) {
        return (entryValue as string).toLowerCase() !== (reference as string).toLowerCase();
    }

    return entryValue !== reference;
};

export const basicFilters: any = {
    exist, eq, eqi, neq, neqi
};
