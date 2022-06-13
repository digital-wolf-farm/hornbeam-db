import { DatabaseError } from '../models/enums';
import { Collection, CollectionIndexes, Entry, NewEntry, Query } from '../models/interfaces';
import { CustomError } from '../utils/errors';
import { utils } from '../utils/utils';
import { basicTypesValidators } from '../validators/basic-types-validators';
import { collectionValidators } from '../validators/collection-validators';
import { entryValidators } from '../validators/entry-validators';

export const collection = (collection: Entry[], indexList: string[]): Collection => {

    // Private methods

    // TODO: Use indexes instead this method
    const checkValuesUniqueness = (data: NewEntry | Entry, uniqueFields: string[]): void => {
        collection.forEach((entry) => {
            if (entry['_id'] === data['_id']) {
                return;
            }

            uniqueFields.forEach((field) => {
                const insertedValue = utils.getPropertyByPath(data, field);
                const storedValue = utils.getPropertyByPath(entry, field);

                // if (insertedValue === Object(insertedValue) || storedValue === Object(storedValue)) {
                //     return;
                // }

                if (insertedValue && storedValue && insertedValue === storedValue) {
                    throw new CustomError(DatabaseError.FieldValueNotUnique, `Added entry must contain unique value for field: ${field}`);
                }
            });


        });
    };

    // Public methods

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
        //  validate inputs

        if (collection.length === 0) {
            return -1;
            // or throw error
        }

        // find first matching entry
        // replace entry
        // return _id of replaced entry
    };

    const remove = (id: number): number => {
        if (!basicTypesValidators.isPositiveInteger(id)) {
            throw new CustomError(DatabaseError.FunctionArgumentMismatch, 'Invalid id.');
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
