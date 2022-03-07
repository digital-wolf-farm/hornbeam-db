import { DBTaskError } from '../models/enums';
import { DBData, Entry, FindOptions, Query, FindResults, SortingOptions, DB, NewEntry } from '../models/interfaces';
import { DBConfig } from '../utils/db-config';
import { TaskError } from '../utils/errors';
import { dbSchemaValidator } from './database-schema-validator';
import { fileOperations } from './file-operations';
import { filters } from './filters';

export function createDB(config: DBConfig): DB {

    let database: DBData;
    let databaseFilePath: string;

    // Private methods

    function getProperty(field: string, object: Entry): unknown {
        return field.split('.').reduce((obj, prop) => {
            if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
                throw DBTaskError.FieldNotFound;
            } else {
                return obj[prop];
            }
        }, object as any);
    }

    function calculateDatabaseUsage(): number {
        return (Buffer.byteLength(JSON.stringify(database)) / (1024 * 1024)) / config.dbSize;
    }

    function checkValuesUniqueness(collectionName: string, data: NewEntry | Entry, uniqueFields: string[]): void {
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

        for (const entry of database[collectionName]) {
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        }

        return ++index;
    }

    function isCollectionCreated(collectionName: string): void {
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
                return false;
            }

            if (entryValue === Object(entryValue)) {
                return;
            }

            return filters[query.type](entryValue, query.value);
        }));
    }

    function findEntryIndex(collectionName: string, id: number): number {
        return database[collectionName].findIndex((entry) => entry['_id'] === id);
    }

    function isDatabaseSizeNotExceeded(): void {
        const dbUsage = calculateDatabaseUsage();

        if (dbUsage >= 100) {
            throw new TaskError(DBTaskError.DatabaseSizeExceeded, `DB usage - ${dbUsage.toFixed(2)}%`);
        }
    }

    function isDatabaseOpen(): void {
        if (!database) {
            throw new TaskError(DBTaskError.DatabaseNotOpen, 'Database must be open before this operation.');
        }
    }

    function getStringOfFieldValue(entry: Entry, field: string): string {
        let rawValue: unknown;

        try {
            rawValue = getProperty(field, entry);
        } catch (e) {
            return;
        }

        if (rawValue === Object(rawValue)) {
            throw new TaskError(DBTaskError.SortDataTypeError, 'Cannot sort results by non primitive value.');
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
    }

    function compareValuesOrder(a: Entry, b: Entry, sortingOptions: SortingOptions[]): number {
        const optionsList = [...sortingOptions];
        const options = optionsList.shift();

        const valueA = getStringOfFieldValue(a, options.field);
        const valueB = getStringOfFieldValue(b, options.field);

        if (valueA === undefined || valueB === undefined) {
            return 0;
        }

        if (optionsList.length === 0) {
            if (options.order === 1) {
                return valueA.localeCompare(valueB, 'en', { sensitivity: 'base', numeric: true });
            } else {
                return valueB.localeCompare(valueA, 'en', { sensitivity: 'base', numeric: true });
            }
        } else {
            if (options.order === 1) {
                return valueA.localeCompare(valueB, 'en', { sensitivity: 'base', numeric: true }) || compareValuesOrder(a, b, optionsList);
            } else {
                return valueB.localeCompare(valueA, 'en', { sensitivity: 'base', numeric: true }) || compareValuesOrder(a, b, optionsList);
            }
        }
    }

    function sortEntries(filteredEntries: Entry[], sortingOptions: SortingOptions[]): void {
        filteredEntries.sort((a, b) => compareValuesOrder(a, b, sortingOptions));
    }

    // Public methods

    async function open(path: string): Promise<void> {
        clearDatabaseCache();

        try {
            databaseFilePath = path;
            database = await fileOperations.read(path);

            dbSchemaValidator.validate(database, config);
            isDatabaseSizeNotExceeded();
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
            dbSchemaValidator.validate(database, config);
            isDatabaseSizeNotExceeded();

            await fileOperations.write(databaseFilePath, database);
        } catch {
            const path = databaseFilePath;
            clearDatabaseCache();

            await open(path);
        }
    }

    function close(): void {
        clearDatabaseCache();
    }

    function stats(): string {
        isDatabaseOpen();

        return calculateDatabaseUsage().toFixed(2);
    }

    function insert(collectionName: string, data: NewEntry, uniqueFields?: string[]): number {
        isDatabaseOpen();

        if (!database[collectionName]) {
            database[collectionName] = [];
        }

        if (uniqueFields) {
            checkValuesUniqueness(collectionName, data, uniqueFields);
        }

        const entryId = createId(collectionName);
        const entry: Entry = { _id: entryId, ...data };

        database[collectionName].push(entry);

        isDatabaseSizeNotExceeded();

        return entryId;
    }

    function find(collectionName: string, query: Query[], options?: FindOptions): FindResults {
        isDatabaseOpen();
        isCollectionCreated(collectionName);

        let foundEntries: Entry[];

        if (query.length === 0) {
            foundEntries = [...database[collectionName]];
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

    function replace(collectionName: string, query: Query[], data: Entry, uniqueFields?: string[]): number {
        // isDatabaseOpen();
        // isCollectionCreated(collectionName);

        // if (options?.unique) {
        //     checkValuesUniqueness(collectionName, data, options.unique)
        // }

        // const entryIndex = findEntryIndex(collectionName, id);

        // if (entryIndex !== -1) {
        //     const newEntry = { ...data };
        //     newEntry['_id'] = id;

        //     database[collectionName][entryIndex] = newEntry;
        // }

        // isDatabaseSizeNotExceeded();

        // return entryIndex;
        return 0;
    }

    function remove(collectionName: string, query: Query[]): number {
        // isDatabaseOpen();
        // isCollectionCreated(collectionName);

        // const entryIndex = findEntryIndex(collectionName, id);

        // if (entryIndex !== -1) {
        //     database[collectionName].splice(entryIndex, 1);
        // }

        // return entryIndex;
        return 0;
    }

    return {
        insert,
        find,
        replace,
        remove,
        open,
        save,
        close,
        stats
    }
}
