import { typesValidators } from '../validators/types-validators';

const text = (entryValue: unknown, reference: unknown): boolean => {
    if (entryValue == null) {
        return false;
    }
    
    if (!typesValidators.isString(reference)) {
        return false;
    }

    if (typesValidators.isBoolean(entryValue)) {
        return false;
    }

    if (typesValidators.isString(entryValue)) {
        return (entryValue as string).includes(reference as string);
    }

    if (typesValidators.isNumber(entryValue)) {
        return (entryValue as number).toString().includes(reference as string);
    }

    if (typesValidators.isArray(entryValue)) {
        let isFound = false;

        (entryValue as Array<unknown>).forEach((elem) => {
            if (text(elem, reference)) {
                isFound = true;
            }
        });

        return isFound;
    }

    if (typesValidators.isObject(entryValue)) {
        let isFound = false;

        Object.values((entryValue as Record<string, unknown>)).forEach((elem) => {
            if (text(elem, reference)) {
                isFound = true;
            }
        });

        return isFound;
    }

    return false;
};

export const textFilters: any = {
    text
};
