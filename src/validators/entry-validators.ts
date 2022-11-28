import { typesValidators } from './types-validators';

const isEntryValid = (value: unknown): boolean => {
    if (!typesValidators.isObject(value)) {
        return false;
    }

    if (!value['_id']) {
        return false;
    }

    if (!typesValidators.isPositiveInteger(value['_id'])) {
        return false;
    }

    if (Object.keys(value).length < 2) {
        return false;
    }

    return true;
}

const isNewEntryValid = (value: unknown): boolean => {
    if (!typesValidators.isObject(value)) {
        return false;
    }

    if (value['_id']) {
        return false;
    }

    if (Object.keys(value).length < 1) {
        return false;
    }

    return true;
}

const isUniqueFieldsArrayValid = (value: string[]): boolean => {
    if (!typesValidators.isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return false;
    }

    if (value.findIndex((field) => field === '_id') !== -1 || !value.every((element) => typesValidators.isString(element))) {
        return false;
    }

    return true;
}

export const entryValidators = {
    isEntryValid,
    isNewEntryValid,
    isUniqueFieldsArrayValid
};
