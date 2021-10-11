import { Buffer } from 'buffer';

import { DBConfig } from './utils/db-config';
import { DB } from './interfaces/db';
import { filters } from './lib/filters';
import { DBMethod } from './enums/db-method';
import { BDTaskError } from './enums/db-task-error';
import { MethodError, TaskError } from './utils/errors';

export default DBConfig;

export function hornbeamDB(configuration: DBConfig) {

    let database: DB;
    let databaseFilePath: string;
    let config: DBConfig;

    if (configuration instanceof DBConfig) {
        config = configuration;
    } else {
        config = new DBConfig();
    }

    // 6. Other private functions

    function clearTemporaryData() {
        database = undefined;
        databaseFilePath = undefined;
    }

    function createId(collection) {
        if (database[collection].length === 0) {
            return 1;
        }

        let index = 0;

        for (let entry of database[collection]) {
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        };

        return ++index;
    }

    function findEntryIndex(collection, queries) {
        return database[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));
    }

    // 7. Database API

    async function openDatabase(path, name) {
        databaseFilePath = `${path}/${name}.json`;

        if (database) {
            database = undefined;
        }

        try {
            verifyArgumentsForOpenDb(path, name);
            const fileContent = await readDbFile(`${databaseFilePath}`);
            const databaseUsage = verifyDataSize(fileContent);
            database = JSON.parse(fileContent);
            verifyDatabaseScheme();

            return databaseUsage;
        } catch (e) {
            if (e.name === BDTaskError.fileNotFound) {
                database = {};

                return '0.00';
            } else {
                clearTemporaryData();

                throw new MethodError(DBMethod.OpenDB, e.error, e.message);
            }
        }
    }

    async function saveDatabase() {
        try {
            verifyDatabase();
            const databaseUsage = verifyDataSize(database);
            verifyDatabaseScheme();
            await writeDbFile(`${databaseFilePath}`, database);

            return databaseUsage;
        } catch (e) {
            throw new MethodError(DBMethod.SaveDB, e.error, e.message);
        } finally {
            clearTemporaryData();
        }
    }

    function closeDatabase() {
        clearTemporaryData();
    }

    function addEntry(collection, data, options) {
        try {
            verifyAddOptions(options);
            verifyDatabase();
            verifyCollectionName(collection);
            verifyEntryData(data, true);
            verifyEntrySize(data);

            if (!database[collection]) {
                database[collection] = [];
            }

            verifyValuesUniqueness(collection, data, options); // TODO: Verify function

            const index = createId(collection);
            const entry = { ...data };

            entry['_id'] = index;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = '';

            database[collection].push(entry);

            return database[collection][database[collection].length - 1];
        } catch (e) {
            clearTemporaryData();

            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function findEntries(collection, queries, options) {
        try {
            verifyQueries(queries, false);
            verifyEditOptions(options);
            verifyDatabase();
            verifyCollectionName(collection);

            let results;

            if (!database[collection]) {
                return [];
            }

            let data = [...database[collection]];

            if (queries.length !== 0) {
                data = data.filter((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));
            }

            if (options && options.sorting && options.sorting.length >= 1) {
                // TODO: add validation of configuration, add asc/desc working, add other data types than strings
                if (options.sorting.length === 1) {
                    data.sort((a, b) => {
                        return a[options.sorting[0].field].localeCompare(b[options.sorting[0].field]);
                    });
                } else {
                    data.sort((a, b) => {
                        return a[options.sorting[0].field].localeCompare(b[options.sorting[0].field]) || a[options.sorting[1].field].localeCompare(b[options.sorting[1].field]);
                    });
                }

            }

            if (options && options.pagination) {
                const pageSize = options.pagination.pageSize || 20;
                const currentPage = options.pagination.currentPage || 1;
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / pageSize);

                results = {
                    data: data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
                    pagination: { pageSize, currentPage, totalPages, totalItems }
                };
            } else {
                results = data;
            }

            return results;
        } catch (e) {
            clearTemporaryData();

            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function removeEntry(collection, queries) {
        try {
            verifyQueries(queries, true);
            verifyDatabase();
            verifyCollection(collection);
            verifyCollectionName(collection);

            const entryIndex = findEntryIndex(collection, queries);
            verifyFoundEntry(entryIndex);

            return database[collection].splice(entryIndex, 1);
        } catch (e) {
            clearTemporaryData();

            throw new MethodError(DBMethod.DeleteEntry, e.error, e.message);
        }
    }

    async function replaceEntry(collection, queries, data) {
        try {
            verifyQueries(queries, true);
            verifyDatabase();
            verifyCollection(collection);
            verifyCollectionName(collection);
            verifyEntryData(data, false);
            verifyEntrySize(data);

            const entryIndex = findEntryIndex(collection, queries);
            verifyFoundEntry(entryIndex);

            database[collection].splice(entryIndex, 1); // TODO: Verify if it is neccessary

            const storedEntry = { ...database[collection][entryIndex] };
            const newEntry = { ...data };
            newEntry['_id'] = storedEntry['_id'];
            newEntry['_createdAt'] = storedEntry['_createdAt'];
            newEntry['_modifiedAt'] = new Date();

            database[collection][entryIndex] = newEntry;

            return database[collection][entryIndex];
        } catch (e) {
            clearTemporaryData();

            throw new MethodError(DBMethod.UpdateEntry, e.error, e.message);
        }
    }

    return {
        openDatabase,
        closeDatabase,
        saveDatabase,
        addEntry,
        findEntries,
        removeEntry,
        replaceEntry,
    };
}
