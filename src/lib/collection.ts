import { filters } from '../filters/filters';
import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, Entry, FindMethods, NewEntry } from '../models/interfaces';
import { HornbeamError, InternalError } from '../utils/errors';
import { utils } from '../utils/utils';
import { typesValidators } from '../validators/types-validators';
import { collectionValidators } from '../validators/collection-validators';
import { entryValidators } from '../validators/entry-validators';
import { findResults } from './find-results';
import { Query } from '../models/types';
import { logicalFilters } from '../filters/logical-filters';

export const collection = (collection: Entry[], indexes: string[]): Collection => {

    const insert = (data: NewEntry): number => {
        try {
            entryValidators.isNewEntryValid(data);

            if (collection.length === 0) {
                collection.push({ _id: 1, ...data });

                return 1;
            }

            if (indexes) {
                const indexedValues = utils.extractIndexes(collection, indexes);

                Object.keys(indexedValues).forEach((index) => {
                    const value = utils.getPropertyByPath(data, index);

                    if (indexedValues[index].includes(value)) {
                        throw new InternalError(DatabaseError.FieldValueNotUnique, `Added entry contains non-unique value for field: ${index}`);
                    }
                })
            }

            const id = collection[collection.length - 1]['_id'] + 1;

            collection.push({ _id: id, ...data });

            return id;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.InsertEntry, e.message);
        }
    };

    const insertMultiple = (dataList: NewEntry[]): number[] => {
        try {
            entryValidators.isNewEntriesListValid(dataList);
            
            const ids: number[] = [];

            dataList.forEach((data) => {
                ids.push(insert(data));
            });

            return ids;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.InsertEntries, e.message);
        }
    };

    const find = (entryId: number): Entry => {
        try {
            if (!typesValidators.isPositiveInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a positive integer');
            }

            if (collection.length === 0) {
                return undefined;
            }

            const index = collection.findIndex((entry) => entry['_id'] === entryId);

            if (index === -1) {
                return undefined;
            }

            return JSON.parse(JSON.stringify(collection[index]));
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.FindEntry, e.message);
        }

    };

    const findMultiple = (query?: Query): FindMethods => {
        try {
            if (!query) {
                return findResults(collection);
            }

            collectionValidators.isQueryValid(query);

            const logicalOperator = Object.keys(query)[0];
            const queryExpressions = query[logicalOperator];

            return findResults(collection.filter((entry) => logicalFilters[logicalOperator](entry, queryExpressions)));
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.FindEntries, e.message);
        }
    };

    const replace = (data: Entry): number => {
        try {
            entryValidators.isEntryValid(data);

            if (collection.length === 0) {
                return -1;
            }

            const index = collection.findIndex((entry) => entry['_id'] === data['_id']);

            if (index === -1) {
                return -1;
            }

            const oldEntry = collection.splice(index, 1)[0];

            if (indexes) {
                const indexedValues = utils.extractIndexes(collection, indexes);

                Object.keys(indexedValues).forEach((index) => {
                    const value = utils.getPropertyByPath(data, index);

                    if (indexedValues[index].includes(value)) {
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
            throw new HornbeamError(e.name, DBMethod.ReplaceEntry, e.message);
        }
    };

    const remove = (entryId: number): number => {
        try {
            if (!typesValidators.isPositiveInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a positive integer');
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
            throw new HornbeamError(e.name, DBMethod.RemoveEntry, e.message);
        }
    };

    const removeMultiple = (entriesId: number[]): number[] => {
        try {
            collectionValidators.isIdsListValid(entriesId);

            const ids: number[] = [];

            entriesId.forEach((id) => {
                const removedEntryId = remove(id);

                if (removedEntryId !== -1) {
                    ids.push(removedEntryId);
                }
            });

            return ids;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.RemoveEntries, e.message);
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
