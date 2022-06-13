import { CollectionIndexes, Entry } from '../models/interfaces';

const getPropertyByPath = (object: Entry, field: string): unknown => {
    return field.split('.').reduce((obj, prop) => {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return undefined;
        } else {
            return obj[prop];
        }
    }, object as any);
};

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

export const utils = {
    getPropertyByPath,
    extractIndexes
};
