import { DBConfig } from './utils/db-config';
import { DB } from './models/db';
import { DBMethod } from './enums/db-method';
import { DBTaskError } from './enums/db-task-error';
import { MethodError } from './utils/errors';
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

    function add(collectionName: string, data: Entry, options: any): number {
        try {
            verifiers.isDatabaseOpen(database);
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isDataValid(data, true, { sizeLimit: config.entrySize });
            // TODO: Verify options object

            if (!database[collectionName]) {
                database[collectionName] = [];
            }

            if (options && options.unique) {
                // TODO: Verify uniqueness of entry
            }

            const entry = { ...data };
            const entryId = createId(collectionName);

            entry['_id'] = entryId;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = undefined;

            database[collectionName].push(entry);

            // TODO: Verify database usage

            return entryId;
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function find(collectionName: string, query: any[], options: any): Entry[] {
        try {
            verifiers.isDatabaseOpen(database);
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            // TODO: Verify query array
            // TODO: Verify options object

            if (!database[collectionName]) {
                return [];
            }

            // TODO: Filter entries
            // TODO: Sort results
            // TODO: Paginate results

            // return results
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function replace(collectionName: string, query: any[], data: Entry, options: any): number {
        try {
            verifiers.isDatabaseOpen(database);
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            // TODO: Verify query array
            verifiers.isDataValid(data, false, { sizeLimit: config.entrySize });

            // TODO: Verify if collection exists

            if (options && options.unique) {
                // TODO: Verify uniqueness of entry
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

            // TODO: Verify database usage

            return entryId;
        } catch (e) {
            clearDatabaseCache();
            throw new MethodError(DBMethod.ReplaceEntry, e.error, e.message);
        }
    }

    function remove(collectionName: string, query: any[]): number {
        try {
            verifiers.isDatabaseOpen(database);
            verifiers.isCollectionNameValid(collectionName, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            // TODO: Verify query array

            // TODO: Verify if collection exists

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
            verifiers.isDatabaseOpen(database);
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
            verifiers.isDatabaseOpen(database);
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
