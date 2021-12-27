import { DBTaskError } from '../models/enums';
import { InsertOptions, DBData, Entry, FindOptions, Query, ReplaceOptions, FindResults, SortingOptions } from '../models/interfaces';
import { DBConfig } from '../utils/db-config';
import { TaskError } from '../utils/errors';
import { fileOperations } from './file-operations';
import { filters } from './filters';
import { helpers } from './helpers';

export function createDB(config: DBConfig) {

    let database: DBData;
    let databaseFilePath: string;

    function getProperty(field: string, object: {}): unknown {
        return field.split('.').reduce((obj, prop) => {
            if (!obj || !obj.hasOwnProperty(prop)) {
                throw 'Property not exists';
            } else {
                return obj[prop];
            }
        }, object);
    }

    function checkValuesUniqueness(collectionName: string, data: Entry, uniqueFields: string[]): void {
        if (database[collectionName].length === 0) {
            return;
        }

        uniqueFields.forEach((field) => {
            let insertedValue: unknown;

            try {
                insertedValue = getProperty(field, data);
            } catch (e) {
                return;
            }

            if (insertedValue === Object(insertedValue)) {
                return;
            }

            database[collectionName].forEach((entry) => {
                if (entry['_id'] === data['_id']) {
                    return;
                }

                let storedValue: unknown;

                try {
                    storedValue = getProperty(field, entry);
                } catch (e) {
                    return;
                }

                if (storedValue === Object(storedValue)) {
                    return;
                }

                if (insertedValue === storedValue) {
                    throw new TaskError(DBTaskError.FieldValueNotUnique, `Added entry must contain unique value for field: ${field}`);
                }
            });
        });
    }

    function clearDatabaseCache() {
        database = undefined;
        databaseFilePath = undefined;
    }

    function createId(collectionName: string): number {
        if (database[collectionName].length === 0) {
            return 1;
        }

        let index = 0;

        for (let entry of database[collectionName]) {
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        };

        return ++index;
    }

    function doesCollectionExists(collectionName: string): void {
        if (!database[collectionName]) {
            throw new TaskError(DBTaskError.CollectionNotExists, 'Attempt to find entry in non existing collection.');
        }
    }

    function findEntries(collectionName: string, queryList: Query[]): Entry[] {
        return database[collectionName].filter((entry) => queryList.every((query) => {
            let entryValue: unknown;

            try {
                entryValue = getProperty(query.field, entry);
            } catch (e) {
                return;
            }

            if (entryValue === Object(entryValue)) {
                return;
            }

            return filters[query.type](entryValue, query.value);
        }));
    }

    function findEntryId(collectionName: string, queryList: Query[]): number {
        return database[collectionName].findIndex((entry) => queryList.every((query) => {
            let entryValue: unknown;

            try {
                entryValue = getProperty(query.field, entry);
            } catch (e) {
                return;
            }

            if (entryValue === Object(entryValue)) {
                return;
            }

            return filters[query.type](entryValue, query.value)
        }));
    }

    function isDatabaseSizeNotExceeded(): void {
        const dbUsage = helpers.calculateDatabaseUsage(database, config.dbSize);

        if (parseFloat(dbUsage) >= 100) {
            throw new TaskError(DBTaskError.DatabaseSizeExceeded, `DB usage - ${dbUsage}%`);
        }
    }

    function isDatabaseOpen(): void {
        if (!database) {
            throw new TaskError(DBTaskError.DatabaseNotOpen, 'Database must be open before this operation.');
        }
    }

    function getStringOfFieldValue(entry: Entry, field: string): string {
        let rawValue = getProperty(field, entry);

        if (rawValue === Object(rawValue)) {
            throw 'Cannot compare non primitive value';
        }

        let value: string;

        if (rawValue == null) {
            value = '';
        } else if (rawValue === true) {
            value = '1'
        } else if (rawValue === false) {
            value = '0';
        } else if (typeof rawValue === 'string') {
            value = rawValue;
        } else {
            value = String(rawValue);
        }

        return value;
    }

    function compareValuesOrder(a: Entry, b: Entry, sortingOptions: SortingOptions[]): number {
        const sortingOption = sortingOptions.shift();

        let valueA = getStringOfFieldValue(a, sortingOption.field);
        let valueB = getStringOfFieldValue(b, sortingOption.field);

        if (sortingOptions.length === 0) {
            return valueA.localeCompare(valueB);
        } else {
            return valueA.localeCompare(valueB) || compareValuesOrder(a, b, sortingOptions);
        }
    }

    function sortEntries(filteredEntries: Entry[], sortingOptions: SortingOptions[]): void {
        filteredEntries.sort((a, b) => compareValuesOrder(a, b, sortingOptions));
    }

    function insert(collectionName: string, data: object, options?: InsertOptions): number {
        isDatabaseOpen();

        if (!database[collectionName]) {
            database[collectionName] = [];
        }

        if (options?.unique) {
            checkValuesUniqueness(collectionName, data, options.unique);
        }

        const entry = { ...data };
        const entryId = createId(collectionName);

        entry['_id'] = entryId;
        entry['_createdAt'] = new Date();
        entry['_modifiedAt'] = null;

        database[collectionName].push(entry);

        isDatabaseSizeNotExceeded();

        return entryId;
    }

    function find(collectionName: string, query: Query[], options?: FindOptions): FindResults {
        isDatabaseOpen();
        doesCollectionExists(collectionName);

        if (!database[collectionName]) {
            return { data: [] };
        }

        let foundEntries: Entry[];

        if (query.length === 0) {
            foundEntries = database[collectionName];
        } else {
            foundEntries = findEntries(collectionName, query);
        }

        if (options?.sort) {
            sortEntries(foundEntries, options.sort);
        }

        if (options?.page) {
            const pagesNumber = Math.ceil(foundEntries.length / options.page.pageSize);

            return {
                data: foundEntries.slice((options.page.pageNumber - 1) * options.page.pageSize, options.page.pageNumber * options.page.pageSize),
                pagination: {
                    entriesNumber: foundEntries.length,
                    pagesNumber: pagesNumber,
                    ...options.page
                }
            };
        }

        return { data: foundEntries };
    }

    function replace(collectionName: string, query: Query[], data: object, options?: ReplaceOptions): number {
        isDatabaseOpen();
        doesCollectionExists(collectionName);

        if (options?.unique) {
            checkValuesUniqueness(collectionName, data, options.unique)
        }

        const entryId = findEntryId(collectionName, query);

        if (entryId !== -1) {
            const storedEntry = { ...database[collectionName][entryId] };
            const newEntry = { ...data };
            newEntry['_id'] = storedEntry['_id'];
            newEntry['_createdAt'] = storedEntry['_createdAt'];
            newEntry['_modifiedAt'] = new Date();

            database[collectionName][entryId] = newEntry;
        }

        isDatabaseSizeNotExceeded();

        return entryId;
    }

    function remove(collectionName: string, query: Query[]): number {
        isDatabaseOpen();
        doesCollectionExists(collectionName);

        const entryId = findEntryId(collectionName, query);

        if (entryId !== -1) {
            database[collectionName].splice(entryId, 1);
        }

        return entryId;
    }

    async function open(path: string): Promise<void> {
        if (database) {
            database = undefined;
        }

        try {
            databaseFilePath = path;
            database = await fileOperations.read(path);

            // TODO: Verify db schema
            // TODO: Verify db size
        } catch (e) {
            if (e.error === DBTaskError.FileNotFound) {
                database = {};
            } else {
                clearDatabaseCache();
                throw e;
            }
        }
    }

    async function save(): Promise<void> {
        try {
            isDatabaseOpen();
            // TODO: Verify db schema
            // TODO: Verify db size
            await fileOperations.write(databaseFilePath, database);
        } catch (e) {
            throw e;
        } finally {
            clearDatabaseCache();
        }
    }

    function close(): void {
        clearDatabaseCache();
    }

    function stat(): any {
        // return db stats
    }

    return {
        open,
        save,
        close,
        stat,
        insert,
        find,
        replace,
        remove
    }

}