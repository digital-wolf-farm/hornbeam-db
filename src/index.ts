import { DBConfig } from './utils/db-config';
import { DB } from './models/db';
import { DBMethod } from './enums/db-method';
import { DBTaskError } from './enums/db-task-error';
import { MethodError, TaskError } from './utils/errors';
import { Entry } from './models/entry';
import { fileOperations } from './lib/file-operations';
import { verifiers } from './lib/verifiers';
import { helpers } from './lib/helpers';

export default function hornbeamDB(configuration: DBConfig) {

    let database: DB;
    let databaseFilePath: string;
    let config: DBConfig;

    if (configuration instanceof DBConfig) {
        config = configuration;
    } else {
        config = new DBConfig();
    }

    // TODO: Add functionality for nested objects
    function areValuesUnique(collectionName: string, data: Entry, uniqueFields: string[]): void {
        if (database[collectionName].length === 0) {
            return;
        }

        uniqueFields.forEach((field) => {
            if (!data[field]) {
                return;
            }

            database[collectionName].forEach((entry) => {
                if (entry[field] && verifiers.areBasicValueEqual(entry[field], data[field])) {
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

    function isDatabaseOpen(): void {
        if (!database) {
            throw new TaskError(DBTaskError.DatabaseNotOpen, 'Database must be open before this operation.');
        }
    }

    function isDatabaseSizeNotExceeded(): void {
        const dbUsage = helpers.calculateDatabaseUsage(database, config.dbSize);

        if (parseFloat(dbUsage) >= 100) {
            throw new TaskError(DBTaskError.DatabaseSizeExceeded, `DB usage - ${dbUsage}%`);
        }
    }

    function add(collectionName: string, data: Entry, options: any): number {
        try {
            isDatabaseOpen();
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isDataValid(data, true, { sizeLimit: config.entrySize });
            verifiers.areAddOptionsValid(options);

            if (!database[collectionName]) {
                database[collectionName] = [];
            }

            if (options && options.unique) {
                areValuesUnique(collectionName, data, options.unique);
            }

            const entry = { ...data };
            const entryId = createId(collectionName);

            entry['_id'] = entryId;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = undefined;

            database[collectionName].push(entry);

            isDatabaseSizeNotExceeded();

            return entryId;
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function find(collectionName: string, query: any[], options: any): Entry[] {
        try {
            isDatabaseOpen();
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isQueryValid(query);
            verifiers.areFindOptionsValid(options);

            doesCollectionExists(collectionName);

            // TODO: Filter entries
            // TODO: Sort results
            // TODO: Paginate results

            // return results
            return [];
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function replace(collectionName: string, query: any[], data: Entry, options: any): number {
        try {
            isDatabaseOpen();
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isQueryValid(query);
            verifiers.isDataValid(data, false, { sizeLimit: config.entrySize });
            verifiers.areAddOptionsValid(options);

            doesCollectionExists(collectionName);

            if (options && options.unique) {
                areValuesUnique(collectionName, data, options.unique)
            }

            const entryId = helpers.findEntryId(database[collectionName], query);

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
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.ReplaceEntry, e.error, e.message);
        }
    }

    function remove(collectionName: string, query: any[]): number {
        try {
            isDatabaseOpen();
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isQueryValid(query);

            doesCollectionExists(collectionName);

            const entryId = helpers.findEntryId(database[collectionName], query);

            if (entryId !== -1) {
                database[collectionName].splice(entryId, 1);
            }

            return entryId;
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.RemoveEntry, e.error, e.message);
        }
    }

    async function open(path: string): Promise<void> {
        databaseFilePath = path;

        if (database) {
            database = undefined;
        }

        try {
            verifiers.isPathValid(path);
            database = await fileOperations.read(path, config.dbSize);
            verifiers.isDatabaseSchemaValid(database);
        } catch (e) {
            if (e.error === DBTaskError.FileNotFound) {
                database = {};
            } else {
                clearDatabaseCache();

                throw new MethodError(DBMethod.OpenDB, e.error, e.message);
            }

        }
    }

    async function save(): Promise<void> {
        try {
            isDatabaseOpen();
            verifiers.isDatabaseSchemaValid(database);
            await fileOperations.write(databaseFilePath, database, config.dbSize);
        } catch (e) {
            throw new MethodError(DBMethod.SaveDB, e.error, e.message);
        } finally {
            clearDatabaseCache();
        }
    }

    function close(): void {
        clearDatabaseCache();
    }

    function stat(): string {
        try {
            isDatabaseOpen();
            return helpers.calculateDatabaseUsage(database, config.dbSize);
        } catch (e) {
            throw new MethodError(DBMethod.StatDB, e.error, e.message);
        }
    }

    return {
        add,
        find,
        replace,
        remove,
        open,
        save,
        close,
        stat
    };
}
