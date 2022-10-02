import { DatabaseError } from '../models/enums';
import { Collection, CollectionIndexes, Entry, NewEntry, Query } from '../models/interfaces';
import { CustomError } from '../utils/errors';
import { utils } from '../utils/utils';
import { basicTypesValidators } from '../validators/basic-types-validators';
import { collectionValidators } from '../validators/collection-validators';
import { entryValidators } from '../validators/entry-validators';

export const collection = (collection: Entry[], indexList: string[]): Collection => {

    const insert = (data: NewEntry): number => {
        if (!entryValidators.isNewEntryValid(data)) {
            throw new CustomError(DatabaseError.FunctionArgumentMismatch, 'Invalid added entry.');
        }

        if (collection.length === 0) {
            collection.push({ _id: 1, ...data });

            return 1;
        }

        if (indexList) {
            const indexes = utils.extractIndexes(collection, indexList);

            Object.keys(indexes).forEach((index) => {
                const value = utils.getPropertyByPath(data, index);

                if (indexes[index].includes(value)) {
                    throw new CustomError(DatabaseError.FieldValueNotUnique, `Added entry must contain unique value for field: ${index}`);
                }
            })
        }

        const id = collection[collection.length - 1]['_id'] + 1;

        collection.push({ _id: id, ...data });

        return id;
    };

    const find = (query: Query[]): Entry[] => {
        //  validate inputs

        if (collection.length === 0) {
            return [];
        }

        if (!query) {
            // return whole collection (cloneDeep collection!)
        }

        return collection;

        // return results of finding + methods: result(), sort(), split() 
    };

    const replace = (id: number, data: Entry): number => {
        if (!basicTypesValidators.isPositiveInteger(id)) {
            throw new CustomError(DatabaseError.FunctionArgumentMismatch, 'Invalid id.');
        }

        if (!entryValidators.isEntryValid(data)) {
            throw new CustomError(DatabaseError.FunctionArgumentMismatch, 'Invalid replacing entry.');
        }

        if (collection.length === 0) {
            return -1;
        }

        const index = collection.findIndex((entry) => entry['_id'] === id);

        if (index === -1) {
            return -1;
        }

        const oldEntry = collection.splice(index, 1)[0];

        if (indexList) {
            const indexes = utils.extractIndexes(collection, indexList);

            Object.keys(indexes).forEach((index) => {
                const value = utils.getPropertyByPath(data, index);

                if (indexes[index].includes(value)) {
                    collection.push({ ...oldEntry });
                    collection.sort((entryA, entryB) => entryA['_id'] - entryB['_id']);

                    throw new CustomError(DatabaseError.FieldValueNotUnique, `Replacing entry must contain unique value for field: ${index}`);
                }
            })
        }

        collection.push({ ...data, ...{ _id: id } });
        collection.sort((entryA, entryB) => entryA['_id'] - entryB['_id']);

        return oldEntry['_id'];
    };

    const remove = (id: number): number => {
        if (!basicTypesValidators.isPositiveInteger(id)) {
            throw new CustomError(DatabaseError.FunctionArgumentMismatch, 'Invalid entry id.');
        }

        if (collection.length === 0) {
            return -1;
        }

        const index = collection.findIndex((entry) => entry['_id'] === id);

        if (index === -1) {
            return -1;
        }

        return collection.splice(index, 1)[0]['_id'];
    };

    return {
        insert,
        find,
        replace,
        remove
    };
};
