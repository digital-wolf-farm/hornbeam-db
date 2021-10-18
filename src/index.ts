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

    function add(collection: string, data: Entry, options: any): void {
        try {
            verifiers.isDatabaseOpen(database);
            verifiers.isCollectionNameValid(collection, { minLength: config.collectionNameMinLength, maxLength: config.collectionNameMaxLength });
            verifiers.isDataValid(data, true, { sizeLimit: config.entrySize });
            // Verify options object

            if (!database[collection]) {
                database[collection] = [];
            }

            if (options && options.unique) {
                // verify uniqueness of entry
            }

            const entry = { ...data };

            // Create index

            // Add metadata
            
            database[collection].push(entry);

            // return index of added entry
        } catch (e) {
            clearDatabaseCache();

            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function find(collection: string, filters: any[], options: any): Entry[] { return []; }
    function replace(collection: string, filters: any[], data: Entry): void { return; }
    function remove(collection: string, filters: any[]): void { return; }

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
