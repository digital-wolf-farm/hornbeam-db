import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Entry, InsertedEntry } from '../models/interfaces';
import { collection } from './collection';
import { HornbeamError, InternalError } from '../utils/errors';
import { DatabaseError, DBMethod, LogicalFilters } from '../models/enums';
import { utils } from '../utils/utils';
import { typesValidators } from '../validators/types-validators';
import { entryValidators } from '../validators/entry-validators';
import * as resultsFn from './results';
import { collectionValidators } from '../validators/collection-validators';
import { Query } from '..';
import { logicalFilters } from '../filters/logical-filters';

describe('Collection', () => {
    const exampleEntry: Entry = {
        _id: 101,
        name: 'Hellen'
    };

    const newEntry: InsertedEntry = {
        name: 'Edward'
    };

    let emptyCollection: Entry[];
    let exampleCollection: Entry[];

    vi.spyOn(resultsFn, 'results');
    vi.spyOn(utils, 'getPropertyByPath');

    beforeEach(() => {
        vi.spyOn(typesValidators, 'isNonNegativeInteger').mockImplementation(() => true);
        vi.spyOn(entryValidators, 'isEntryValid').mockImplementation(() => true);
        vi.spyOn(collectionValidators, 'isQueryValid').mockImplementation(() => true);
        vi.spyOn(utils, 'extractIndexes').mockImplementation(() => exampleCollection.map((elem) => elem.login));

        emptyCollection = [];
        exampleCollection = [
            { _id: 1, name: 'Adam', login: 'adam123' },
            { _id: 2, name: 'Barbra', login: 'bbxd' },
            { _id: 9, name: 'Isabelle', login: 'pickles-lover' },
            { _id: 23, name: 'Walter', login: 'last_king_1' },
        ];
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

    describe('Insert', () => {
        it('throws error when entry schema is not valid', () => {
            const expectedError = new HornbeamError(DatabaseError.EntryFormatError, DBMethod.InsertEntry, 'Inserted entry cannot contain _id property');
            vi.spyOn(entryValidators, 'isEntryValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.EntryFormatError, 'Inserted entry cannot contain _id property');
            });
            const chosenCollection = collection(emptyCollection);

            const resultFn = () => { chosenCollection.insert(exampleEntry as unknown as InsertedEntry); };

            expect(resultFn).toThrow(expectedError);
        });

        it('adds entry with _id equal to 1 when collection is empty', () => {
            const chosenCollection = collection(emptyCollection);

            const instertedEntryId = chosenCollection.insert(newEntry);

            expect(instertedEntryId).toBe(1);
        });

        it('adds entry with highest _id but does not update index when index not set', () => {
            const chosenCollection = collection(exampleCollection);

            const instertedEntryId = chosenCollection.insert(newEntry);

            expect(instertedEntryId).toBe(24);
            expect(utils.extractIndexes).not.toHaveBeenCalled();
        });

        it('adds entry with highest _id and update indexes twice when index is set on field not present in entry', () => {
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation(() => undefined);
            const chosenCollection = collection(exampleCollection, 'login');

            const instertedEntryId = chosenCollection.insert(newEntry);

            expect(instertedEntryId).toBe(24);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('adds entry with highest _id and update indexes twice when index is set but inserted value is unique', () => {
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation(() => undefined);
            const chosenCollection = collection(exampleCollection, 'login');

            const instertedEntryId = chosenCollection.insert({ ...newEntry, login: 'superDancer' });

            expect(instertedEntryId).toBe(24);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('update indexes once and throws error when when index is set and inserted value is already used', () => {
            const expectedError = new HornbeamError(DatabaseError.FieldValueNotUnique, DBMethod.InsertEntry, 'Inserted entry contains non-unique value for field: login');
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation(() => 'pickles-lover');
            const chosenCollection = collection(exampleCollection, 'login');

            const resultFn = () => { chosenCollection.insert({ ...newEntry, login: 'pickles-lover' }); };

            expect(resultFn).toThrow(expectedError);
        });
    });

    describe('Get', () => {
        it('throws error when passed id is not non-negative integer', () => {
            const expectedError = new HornbeamError(DatabaseError.EntryIdError, DBMethod.GetEntry, 'Provided entry id is not a non-negative integer');
            vi.spyOn(typesValidators, 'isNonNegativeInteger').mockImplementation(() => {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a non-negative integer');
            });
            const chosenCollection = collection(exampleCollection);

            const resultFn = () => { chosenCollection.get(-1); };

            expect(resultFn).toThrow(expectedError);
        });

        it('returns undefined when collection is empty', () => {
            const chosenCollection = collection(emptyCollection);

            const foundEntry = chosenCollection.get(0);

            expect(foundEntry).toBeUndefined();
        });

        it('returns undefined when collection does not have passed id', () => {
            const chosenCollection = collection(exampleCollection);

            const foundEntry = chosenCollection.get(1001);

            expect(foundEntry).toBeUndefined();
        });

        it('returns entry when collection have passed id', () => {
            const chosenCollection = collection(exampleCollection);

            const foundEntry = chosenCollection.get(9);

            expect(foundEntry).toEqual({ _id: 9, name: 'Isabelle', login: 'pickles-lover' });
        });

        it('returns entry without reference to collection', () => {
            const chosenCollection = collection(exampleCollection);
            const foundEntry = chosenCollection.get(9);

            const foundSameEntry = chosenCollection.get(9);

            expect(foundEntry === foundSameEntry).toBe(false);
        });
    });

    describe('Find', () => {
        it('pass whole collection to results when no query passed', () => {
            const chosenCollection = collection(exampleCollection);

            chosenCollection.find();

            expect(resultsFn.results).toHaveBeenCalledWith(exampleCollection);
        });

        it('throws error when query is not valid', () => {
            const expectedError = new HornbeamError(DatabaseError.FindQueryError, DBMethod.FindEntries, 'Expressions list is not an array');
            vi.spyOn(collectionValidators, 'isQueryValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.FindQueryError, 'Expressions list is not an array');
            });
            const chosenCollection = collection(exampleCollection);

            const resultFn = () => { chosenCollection.find({ and: { login: 'hamster' } } as unknown as Query); };

            expect(resultFn).toThrow(expectedError);
        });

        it('calls results method when valid query is passed', () => {
            vi.spyOn(logicalFilters, LogicalFilters.Or).mockImplementation((entry) => entry['login'] === 'last_king_1');
            const query: Query = { or: [{ login: { eq: 'last_king_1' } }]};
            const chosenCollection = collection(exampleCollection);

            chosenCollection.find(query);

            expect(logicalFilters.or).toHaveBeenCalledTimes(exampleCollection.length);
            expect(logicalFilters.or).toHaveBeenCalledWith({ _id: 23, name: 'Walter', login: 'last_king_1' }, [{ login: { eq: 'last_king_1' } }]);
            expect(resultsFn.results).toHaveBeenCalledWith([{ _id: 23, name: 'Walter', login: 'last_king_1' }]);
        });
    });

    describe('Replace', () => {
        it('throws error when entry schema is not valid', () => {
            const expectedError = new HornbeamError(DatabaseError.EntryFormatError, DBMethod.ReplaceEntry, 'Missing _id property');
            vi.spyOn(entryValidators, 'isEntryValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.EntryFormatError, 'Missing _id property');
            });
            const chosenCollection = collection(emptyCollection);

            const resultFn = () => { chosenCollection.replace(newEntry as unknown as Entry); };

            expect(resultFn).toThrow(expectedError);
        });

        it('returns undefined when collection is empty', () => {
            const chosenCollection = collection(emptyCollection);

            const replacedEntryId = chosenCollection.replace(exampleEntry);

            expect(replacedEntryId).toBeUndefined();
            expect(emptyCollection.length).toBe(0);
        });

        it('returns undefined when collection is not empty but _id cannot be found', () => {
            const chosenCollection = collection(exampleCollection);

            const replacedEntryId = chosenCollection.replace(exampleEntry);

            expect(replacedEntryId).toBeUndefined();
        });

        it('does not update indexes when collection is open without index', () => {
            const chosenCollection = collection(exampleCollection);

            chosenCollection.replace({ _id: 23, name: 'Walter', login: 'last_king_99' });

            expect(utils.extractIndexes).not.toHaveBeenCalled();
        });

        it('returns replaced entry _id when collection is not empty and contains provided _id', () => {
            vi.spyOn(typesValidators, 'isNonNegativeInteger').mockImplementation(() => true);
            const updatedEntry = { _id: 23, name: 'Walter', login: 'last_king_99' };
            const chosenCollection = collection(exampleCollection);

            const replacedEntryId = chosenCollection.replace(updatedEntry);

            expect(replacedEntryId).toBe(23);
            expect(chosenCollection.get(23)).toEqual(updatedEntry);
        });

        it('updates indexes once when collection is open with index but replacing fails', () => {
            const chosenCollection = collection(exampleCollection, 'login');

            const replacedEntryId = chosenCollection.replace(exampleEntry);

            expect(replacedEntryId).toBeUndefined();
            expect(utils.extractIndexes).toHaveBeenCalledTimes(1);
        });

        it('updates indexes twice when collection is open with index and replacing successed', () => {
            const updatedEntry = { _id: 23, name: 'Walter', login: 'last_king_99' };
            const chosenCollection = collection(exampleCollection, 'login');

            const replacedEntryId = chosenCollection.replace(updatedEntry);

            expect(replacedEntryId).toBe(23);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('does not extract replaced and replacing values when indexed values list is empty', () => {
            vi.spyOn(utils, 'extractIndexes').mockImplementation(() => []);
            const updatedEntry = { _id: 23, name: 'Walter', login: 'last_king_99' };
            const chosenCollection = collection(exampleCollection, 'login');

            const replacedEntryId = chosenCollection.replace(updatedEntry);

            expect(replacedEntryId).toBe(23);
            expect(utils.getPropertyByPath).not.toHaveBeenCalled();
        });

        it('extracts replaced and replacing values when indexed values list is not empty', () => {
            const updatedEntry = { _id: 23, name: 'Walter', login: 'last_king_99' };
            const chosenCollection = collection(exampleCollection, 'login');

            const replacedEntryId = chosenCollection.replace(updatedEntry);

            expect(replacedEntryId).toBe(23);
            expect(utils.getPropertyByPath).toHaveBeenCalledWith(exampleCollection[3], 'login');
            expect(utils.getPropertyByPath).toHaveBeenCalledWith(updatedEntry, 'login');
        });

        it('throws error when replacing entry contains changed indexed value and is listed', () => {
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation((data, field) => (data as any).login)
            const expectedError = new HornbeamError(DatabaseError.FieldValueNotUnique, DBMethod.ReplaceEntry, 'Replacing entry contains non-unique value for field: login');
            const updatedEntry = { _id: 23, name: 'Walter', login: 'pickles-lover' };
            const chosenCollection = collection(exampleCollection, 'login');

            const resultFn = () => { chosenCollection.replace(updatedEntry); };

            expect(resultFn).toThrow(expectedError);
        });

        it('does not throw error when replacing entry contains changed indexed value but is not listed', () => {
            const updatedEntry = { _id: 23, name: 'Walter', login: 'better-pickles-lover' };
            const chosenCollection = collection(exampleCollection, 'login');

            const resultFn = () => { chosenCollection.replace(updatedEntry); };

            expect(resultFn).not.toThrow();
        });
    });

    describe('Remove', () => {
        it('throws error when passed id is not non-negative integer', () => {
            const expectedError = new HornbeamError(DatabaseError.EntryIdError, DBMethod.RemoveEntry, 'Provided entry id is not a non-negative integer');
            vi.spyOn(typesValidators, 'isNonNegativeInteger').mockImplementation(() => {
                throw new InternalError(DatabaseError.EntryIdError, 'Provided entry id is not a non-negative integer');
            });
            const chosenCollection = collection(exampleCollection, 'login');

            const resultFn = () => { chosenCollection.remove(-1); };

            expect(resultFn).toThrow(expectedError);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(1);
        });

        it('returns undefined when collection is empty', () => {
            const chosenCollection = collection(emptyCollection, 'login');

            const foundEntry = chosenCollection.remove(0);

            expect(foundEntry).toBeUndefined();
            expect(utils.extractIndexes).toHaveBeenCalledTimes(1);
        });

        it('returns undefined when collection does not have passed id', () => {
            const chosenCollection = collection(exampleCollection, 'login');

            const foundEntry = chosenCollection.remove(1001);

            expect(foundEntry).toBeUndefined();
            expect(utils.extractIndexes).toHaveBeenCalledTimes(1);
        });

        it('updates indexes again and returns id when entry removed from collection with index', () => {
            const chosenCollection = collection(exampleCollection, 'login');

            const removedEntryId = chosenCollection.remove(9);

            expect(removedEntryId).toBe(9);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('returns id without updating indexes when entry removed from collection without index', () => {
            const chosenCollection = collection(exampleCollection);

            const removedEntryId = chosenCollection.remove(9);

            expect(removedEntryId).toBe(9);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(0);
        });

        it('removes entry from collection when passed existing id', () => {
            const chosenCollection = collection(exampleCollection);
            chosenCollection.remove(9);

            const removedEntry = chosenCollection.get(9);

            expect(removedEntry).toBeUndefined();
        });
    });
});