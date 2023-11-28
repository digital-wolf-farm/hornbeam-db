import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, Entry, FindMethods, InsertedEntry } from '../models/interfaces';
import { HornbeamError, InternalError } from '../utils/errors';
import { utils } from '../utils/utils';
import { typesValidators } from '../validators/types-validators';
import { collectionValidators } from '../validators/collection-validators';
import { entryValidators } from '../validators/entry-validators';
import { findResults } from './find-results';
import { Query } from '../models/types';
import { logicalFilters } from '../filters/logical-filters';

export const collection = (collection: Entry[], index?: string): Collection => {
    let indexedValues: unknown[];

    if (index) {
        indexedValues = utils.extractIndexes(collection, index);
    }

    const insert = (entry: InsertedEntry): number => {
        try {
            entryValidators.isEntryValid(entry, true);

            if (collection.length === 0) {
                collection.push({ _id: 1, ...entry });

                return 1;
            }

            if (index && indexedValues?.length > 0) {
                const value = utils.getPropertyByPath(entry, index);
            
                if (value && indexedValues.includes(value)) {
                    throw new InternalError(DatabaseError.FieldValueNotUnique, `Inserted entry contains non-unique value for field: ${index}`);
                }
            }

            const id = collection[collection.length - 1]['_id'] + 1;

            collection.push({ _id: id, ...entry });

            if (index) {
                indexedValues = utils.extractIndexes(collection, index);
            }

            return id;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.InsertEntry, e.message);
        }
    };

    const get = (entryId: number): Entry | undefined => {
        try {
            if (!typesValidators.isNonNegativeInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a non-negative integer');
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
            throw new HornbeamError(e.name, DBMethod.GetEntry, e.message);
        }
    };

    const find = (query?: Query): FindMethods => {
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

    const replace = (entry: Entry): number | undefined => {
        try {
            entryValidators.isEntryValid(entry, false);

            if (collection.length === 0) {
                return undefined;
            }

            const entryIndex = collection.findIndex((storedEntry) => storedEntry['_id'] === entry['_id']);

            if (entryIndex === -1) {
                return undefined;
            }

            const oldEntry = collection[entryIndex];

            if (index && indexedValues?.length > 0) {
                const valueOld = utils.getPropertyByPath(oldEntry, index);
                const valueNew = utils.getPropertyByPath(entry, index);
            
                if (valueOld !== valueNew && indexedValues.includes(valueNew)) {
                    throw new InternalError(DatabaseError.FieldValueNotUnique, `Replacing entry contains non-unique value for field: ${index}`);
                }
            }

            collection[entryIndex] = entry;

            if (index) {
                indexedValues = utils.extractIndexes(collection, index);
            }

            return entry['_id'];
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.ReplaceEntry, e.message);
        }
    };

    const remove = (entryId: number): number | undefined => {
        try {
            if (!typesValidators.isNonNegativeInteger(entryId)) {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a positive integer');
            }

            if (collection.length === 0) {
                return undefined;
            }

            const entryIndex = collection.findIndex((entry) => entry['_id'] === entryId);

            if (entryIndex === -1) {
                return undefined;
            }

            collection.splice(entryIndex, 1);

            if (index) {
                indexedValues = utils.extractIndexes(collection, index);
            }

            return entryId;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.RemoveEntry, e.message);
        }
    };

    return {
        insert,
        get,
        find,
        replace,
        remove
    };
};
