import { Entry } from '../models/interfaces';
import { typesValidators } from '../validators/types-validators';

const compareValuesOrder = (a: Entry, b: Entry, field: string, order: string, languageCode: string): number => {
    const valueA = getPropertyByPath(a, field);
    const valueB = getPropertyByPath(b, field);

    if (getValueType(valueA) === getValueType(valueB)) {
        return compareSameTypes(valueA, valueB, order, languageCode);
    } else {
        return compareDifferentTypes(valueA, valueB, order);
    }
};

const extractIndexes = (collection: Entry[], index: string): unknown[] => {
    if (!index) {
        return [];
    }

    if (index === '_id') {
        return [];
    }

    const indexedValues: unknown[] = [];

    collection.forEach((entry) => {
        const value = getPropertyByPath(entry, index);

        if (value && (typeof value === 'string' || typeof value === 'number')) {
            indexedValues.push(value);
        }
    });

    return indexedValues;
};

const getPropertyByPath = (data: unknown, field: string): unknown => {
    // TODO: Add other special fields like: _size

    if (field === '_') {
        return data;
    }

    if (!data || !field) {
        return undefined;
    }

    const fieldSteps = field.split('.');

    if (typesValidators.isObject(data)) {
        const value = data[fieldSteps[0]];

        if (typesValidators.isObject(value) || Array.isArray(value)) {
            if (fieldSteps.length > 1) {
                return getPropertyByPath(value, fieldSteps.slice(1).join('.'));
            } else {
                return value;
            }
        } else {
            if (fieldSteps.length > 1) {
                return undefined;
            } else {
                return value;
            }
        }
    } else if (Array.isArray(data)) {
        if (typesValidators.isNonNegativeInteger(Number(fieldSteps[0]))) {
            if (fieldSteps.length === 1) {
                return data[Number(fieldSteps[0])];
            } else {
                if (typesValidators.isPrimitive(data[Number(fieldSteps[0])])) {
                    return undefined;
                } else {
                    return getPropertyByPath(data[Number(fieldSteps[0])], fieldSteps.slice(1).join('.'));
                }
            }
        } else {
            // INFO: Array requires all elements to be the same type: primitive, object or array
            if (data.every((elem) => typesValidators.isPrimitive(elem))) {
                return undefined;
            } else {
                let values: unknown[] = [];

                data.forEach((elem) => {
                    console.log('elem', elem, fieldSteps.join('.'));
                    const value = getPropertyByPath(elem, fieldSteps.join('.'));

                    if (value) {
                        values.push(value);
                    }
                });

                return values.length > 0 ? values : undefined;
            }
        }
    } else {
        return undefined;
    }

    // // TODO: Add traversing by array elements
    // return field.split('.').reduce((obj, prop) => {
    //     if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
    //         return undefined;
    //     } else {
    //         return obj[prop];
    //     }
    // }, object as any);
};

const getValueType = (value: unknown): string => {
    if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return typeof value;
    }

    if (value == null) {
        return 'null';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    return 'object';
};

const compareSameTypes = (a: unknown, b: unknown, order: string, languageCode: string): number => {
    if (typeof a === 'string' && typeof b === 'string') {
        return compareStrings(a, b, order, languageCode);
    }

    if (typeof a === 'number' && typeof b === 'number') {
        return compareNumbers(a, b, order);
    }

    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return compareBooleans(a, b, order);
    }

    return 0;
};

const compareDifferentTypes = (a: unknown, b: unknown, order: string): number => {
    let aTypeIndex = getValueTypeIndex(a);
    let bTypeIndex = getValueTypeIndex(b);

    return compareNumbers(aTypeIndex, bTypeIndex, order);
};

const compareStrings = (a: string, b: string, order: string, languageCode: string): number => {
    if (order === '+1') {
        return a.localeCompare(b, languageCode ?? 'en', { sensitivity: 'base', numeric: true });
    } else {
        return b.localeCompare(a, languageCode ?? 'en', { sensitivity: 'base', numeric: true });
    }
};

const compareNumbers = (a: number, b: number, order: string): number => {
    if (order === '+1') {
        return a - b;
    } else {
        return b - a;
    }
};

const compareBooleans = (a: boolean, b: boolean, order: string): number => {
    if (order === '+1') {
        return (a === b) ? 0 : a ? -1 : 1;
    } else {
        return (a === b) ? 0 : a ? 1 : -1;
    }
};

const getValueTypeIndex = (value: unknown): number => {
    if (value === null) {
        return 1;
    }

    if (typeof value === 'boolean') {
        return 2;
    }

    if (typeof value === 'number') {
        return 3;
    }

    if (typeof value === 'string') {
        return 4;
    }

    if (Array.isArray(value)) {
        return 5;
    }

    return 6;
};

export const utils = {
    compareValuesOrder,
    extractIndexes,
    getPropertyByPath
};
