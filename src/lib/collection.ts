import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, Entry, NewEntry, Query } from '../models/interfaces';
import { CustomError, InternalError } from '../utils/errors';
import { utils } from '../utils/utils';
import { basicTypesValidators } from '../validators/basic-types-validators';
import { collectionValidators } from '../validators/collection-validators';
import { entryValidators } from '../validators/entry-validators';

export const collection = (collection: Entry[], indexList: string[]): Collection => {

    const insert = (data: NewEntry): number => {
        try {
            if (!entryValidators.isNewEntryValid(data)) {
                throw new InternalError(DatabaseError.EntryFormatError, 'Invalid format of inserted entry.');
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
                        throw new InternalError(DatabaseError.FieldValueNotUnique, `Added entry must contain unique value for field: ${index}`);
                    }
                })
            }

            const id = collection[collection.length - 1]['_id'] + 1;

            collection.push({ _id: id, ...data });

            return id;
        } catch (e) {
            throw new CustomError(e.name, DBMethod.InsertEntry, e.message);
        }
    };

    const insertMultiple = (dataList: NewEntry[]): number[] => {
        try {
            if (!collectionValidators.isEntriesListValid(dataList)) {
                throw new InternalError(DatabaseError.EntryFormatError, 'Invalid list of entries.');
            }
            
            const ids: number[] = [];

            dataList.forEach((data) => {
                ids.push(insert(data));
            });

            return ids;
        } catch (e) {
            throw new CustomError(e.name, DBMethod.InsertEntries, e.message);
        }
    };

    const find = (entryId: number): Entry => {
        try {
            if (!basicTypesValidators.isPositiveInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Invalid entry id.');
            }

            if (collection.length === 0) {
                return undefined;
            }

            const index = collection.findIndex((entry) => entry['_id'] === entryId);

            if (index === -1) {
                return undefined;
            }

            return collection[index];
        } catch (e) {
            throw new CustomError(e.name, DBMethod.FindEntry, e.message);
        }

    };

    // return { sort(), result() } instead of Entry[]
    const findMultiple = (query?: Query[]): Entry[] => {
        try {
            if (!query) {
                return collection;
            }

            // validate input

            const foundEntries: Entry[] = [];

            // 
            return collection;
        } catch (e) {
            throw new CustomError(e.name, DBMethod.FindEntries, e.message);
        }
    };

    const replace = (data: Entry): number => {
        try {
            if (!entryValidators.isEntryValid(data)) {
                throw new InternalError(DatabaseError.EntryFormatError, 'Invalid replacing entry.');
            }

            if (collection.length === 0) {
                return -1;
            }

            const index = collection.findIndex((entry) => entry['_id'] === data['_id']);

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

                        throw new InternalError(DatabaseError.FieldValueNotUnique, `Replacing entry must contain unique value for field: ${index}`);
                    }
                })
            }

            collection.push(data);
            collection.sort((entryA, entryB) => entryA['_id'] - entryB['_id']);

            return oldEntry['_id'];
        } catch (e) {
            throw new CustomError(e.name, DBMethod.ReplaceEntry, e.message);
        }
    };

    const remove = (entryId: number): number => {
        try {
            if (!basicTypesValidators.isPositiveInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Invalid entry id.');
            }

            if (collection.length === 0) {
                return -1;
            }

            const index = collection.findIndex((entry) => entry['_id'] === entryId);

            if (index === -1) {
                return -1;
            }

            return collection.splice(index, 1)[0]['_id'];
        } catch (e) {
            throw new CustomError(e.name, DBMethod.RemoveEntry, e.message);
        }
    };

    const removeMultiple = (entriesId: number[]): number[] => {
        try {
            if (!collectionValidators.isIdsListValid(entriesId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Invalid list of entry ids.');
            }

            const ids: number[] = [];

            entriesId.forEach((id) => {
                const removedEntryId = remove(id);

                if (removedEntryId !== -1) {
                    ids.push(removedEntryId);
                }
            });

            return ids;
        } catch (e) {
            throw new CustomError(e.name, DBMethod.RemoveEntries, e.message);
        }
    };

    return {
        insert,
        insertMultiple,
        find,
        findMultiple,
        replace,
        remove,
        removeMultiple
    };
};
