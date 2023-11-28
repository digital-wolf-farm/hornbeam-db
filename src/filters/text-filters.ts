import { TextFiltersList } from '../models/types';
import { typesValidators } from '../validators/types-validators';

const text = (entryValue: unknown, reference: unknown): boolean => {
    // INFO: Escaping special characters is up to server
    // INFO: Searching for text is case insensitive
    // INFO: Searching for text is diacritic sensitive

    if (entryValue == null) {
        return false;
    }
    
    if (typeof reference !== 'string' || reference === '') {
        return false;
    }

    if (typeof entryValue === 'boolean') {
        return false;
    }

    if (typeof entryValue === 'string') {
        return (entryValue as string).toLowerCase().includes((reference as string).toLowerCase());
    }

    if (typeof entryValue === 'number') {
        return (entryValue as number).toString().includes(reference as string);
    }

    if (Array.isArray(entryValue)) {
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

export const textFilters: TextFiltersList = {
    text
};
