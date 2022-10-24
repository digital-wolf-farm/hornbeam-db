import { CollectionIndexes, Entry, SortingField } from '../models/interfaces';

function compareValuesOrder(a: Entry, b: Entry, field: string, order: string, languageCode: string): number {
    const valueA = getPropertyByPath(a, field);
    const valueB = getPropertyByPath(b, field);

    const valueAType = getValueType(valueA);
    const valueBType = getValueType(valueB);

    if (valueAType === valueBType) {
        return compareSameTypes(valueA, valueB, order, languageCode);
    } else {
        return compareDifferentTypes(valueA, valueB, order);
    }

    // // const valueA = getStringOfFieldValue(a, field);
    // // const valueB = getStringOfFieldValue(b, field);

    // if (valueA === undefined || valueB === undefined) {
    //     return 0;
    // }

    // if (order === '+1') {
    //     return valueA.localeCompare(valueB, languageCode ?? 'en', { sensitivity: 'base', numeric: true });
    // } else {
    //     return valueB.localeCompare(valueA, languageCode ?? 'en', { sensitivity: 'base', numeric: true });
    // }
}

const extractIndexes = (collection: Entry[], indexList: string[]): CollectionIndexes => {
    const indexes: CollectionIndexes = {};

    collection.forEach((entry) => {
        indexList.forEach((index) => {
            if (index !== '_id') {
                if (!indexes[index]) {
                    indexes[index] = [];
                }

                const value = getPropertyByPath(entry, index);

                indexes[index].push(value);
            }
        });
    });

    return indexes;
};

const getPropertyByPath = (object: Entry, field: string): unknown => {
    return field.split('.').reduce((obj, prop) => {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return undefined;
        } else {
            return obj[prop];
        }
    }, object as any);
};

function getStringOfFieldValue(entry: Entry, field: string): string {
    let rawValue: unknown;

    rawValue = getPropertyByPath(entry, field);

    if (rawValue === Object(rawValue)) {
        throw 'It is not a primitive value!';
    }

    let value: string;

    if (rawValue == null) {
        value = '';
    } else if (rawValue === true) {
        value = '0'
    } else if (rawValue === false) {
        value = '1';
    } else if (typeof rawValue === 'string') {
        value = rawValue;
    } else {
        value = String(rawValue);
    }

    return value;
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
    return;
};

const compareDifferentTypes = (a: unknown, b: unknown, order: string): number => {
    return;
};

export const utils = {
    compareValuesOrder,
    extractIndexes,
    getPropertyByPath
};
