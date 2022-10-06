import { basicTypesValidators } from './basic-types-validators';

const isEntryValid = (value: unknown): boolean => {
    if (!basicTypesValidators.isObject(value)) {
        return false;
    }

    if (!value['_id']) {
        return false;
    }

    if (!basicTypesValidators.isPositiveInteger(value['_id'])) {
        return false;
    }

    if (Object.keys(value).length < 2) {
        return false;
    }

    return true;
}

const isNewEntryValid = (value: unknown): boolean => {
    if (!basicTypesValidators.isObject(value)) {
        return false;
    }

    if (value['_id']) {
        return false;
    }

    if (Object.keys(value).length < 2) {
        return false;
    }

    return true;
}

const isUniqueFieldsArrayValid = (value: string[]): boolean => {
    if (!basicTypesValidators.isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return false;
    }

    if (value.findIndex((field) => field === '_id') !== -1 || !value.every((element) => basicTypesValidators.isString(element))) {
        return false;
    }

    return true;
}

export const entryValidators = {
    isEntryValid,
    isNewEntryValid,
    isUniqueFieldsArrayValid
};
