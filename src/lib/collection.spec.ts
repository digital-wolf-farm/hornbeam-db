import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Entry, InsertedEntry } from '../models/interfaces';
import { collection } from './collection';
import { HornbeamError, InternalError } from '../utils/errors';
import { DatabaseError, DBMethod } from '../models/enums';
import { dataValidators } from '../validators/data-validators';
import { utils } from '../utils/utils';
import { typesValidators } from '../validators/types-validators';

describe('Collection', () => {
    let emptyCollection: Entry[];
    let exampleCollection: Entry[];

    const exampleEntry: Entry = {
        _id: 101,
        name: 'Hellen'
    };

    const newEntry: InsertedEntry = {
        name: 'Edward'
    };

    vi.spyOn(utils, 'extractIndexes');

    beforeEach(() => {
        emptyCollection = [];
        exampleCollection = [
            { _id: 1, name: 'Adam', login: 'adam123' },
            { _id: 2, name: 'Barbra', login: 'bbxd' },
            { _id: 9, name: 'Isabelle', login: 'pickles-lover' },
            { _id: 23, name: 'Walter', login: 'last_king_1' },
        ];
    });

    afterEach(() => {
        vi.resetAllMocks();
    })

    describe('Insert', () => {
        beforeEach(() => {
            vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => { });
        });

        it('throws error when entry schema is not valid', () => {
            const expectedError = new HornbeamError(DatabaseError.EntryFormatError, DBMethod.InsertEntry, 'Inserted entry cannot contain _id property');
            vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {
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
            vi.spyOn(utils, 'extractIndexes').mockImplementation(() => exampleCollection.map((elem) => elem.login));
            const chosenCollection = collection(exampleCollection, 'login');

            const instertedEntryId = chosenCollection.insert(newEntry);

            expect(instertedEntryId).toBe(24);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('adds entry with highest _id and update indexes twice when index is set but inserted value is unique', () => {
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation(() => undefined);
            vi.spyOn(utils, 'extractIndexes').mockImplementation(() => exampleCollection.map((elem) => elem.login));
            const chosenCollection = collection(exampleCollection, 'login');

            const instertedEntryId = chosenCollection.insert({ ...newEntry, login: 'superDancer' });

            expect(instertedEntryId).toBe(24);
            expect(utils.extractIndexes).toHaveBeenCalledTimes(2);
        });

        it('update indexes once and throws error when when index is set and inserted value is already used', () => {
            const expectedError = new HornbeamError(DatabaseError.FieldValueNotUnique, DBMethod.InsertEntry, 'Inserted entry contains non-unique value for field: login');
            vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.FieldValueNotUnique, 'Inserted entry contains non-unique value for field: login');
            });
            vi.spyOn(utils, 'getPropertyByPath').mockImplementation(() => 'pickles-lover');
            vi.spyOn(utils, 'extractIndexes').mockImplementation(() => exampleCollection.map((elem) => elem.login));
            const chosenCollection = collection(exampleCollection, 'login');

            const resultFn = () => { chosenCollection.insert({ ...newEntry, login: 'pickles-lover' }); };

            expect(resultFn).toThrow(expectedError);
        });
    });

    describe('Get', () => {
        beforeEach(() => {
            vi.spyOn(typesValidators, 'isNonNegativeInteger').mockImplementation(() => true);
        });

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
});