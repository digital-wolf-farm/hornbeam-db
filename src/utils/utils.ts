import { CollectionIndexes, Entry, NewEntry } from '../models/interfaces';

const compareValuesOrder = (a: Entry, b: Entry, field: string, order: string, languageCode: string): number => {
    const valueA = getPropertyByPath(a, field);
    const valueB = getPropertyByPath(b, field);

    if (getValueType(valueA) === getValueType(valueB)) {
        return compareSameTypes(valueA, valueB, order, languageCode);
    } else {
        return compareDifferentTypes(valueA, valueB, order);
    }
};

const extractIndexes = (collection: Entry[], indexList: string[]): CollectionIndexes => {
    // INFO: Args validation should be done before calling this function
    const indexes: CollectionIndexes = {};

    indexList.forEach((index) => {
        if (indexes[index]) {
            return;
        }

        const indexValues: unknown[] = [];

        collection.forEach((entry) => {
            if (index !== '_id') {
                const value = getPropertyByPath(entry, index);

                if (value) {
                    indexValues.push(value);
                }
            }
        });

        if (indexValues.length > 0) {
            indexes[index] = indexValues;
        }
    });

    return indexes;
};

const getPropertyByPath = (object: Entry | NewEntry, field: string): unknown => {
    // INFO: Args validation should be done before calling this function

    if (field === '_') {
        return object;
    }

    return field.split('.').reduce((obj, prop) => {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return undefined;
        } else {
            return obj[prop];
        }
    }, object as any);
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
