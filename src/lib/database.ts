import { DBTaskError } from '../models/enums';
import { InsertOptions, DBData, Entry, FindOptions, Query, ReplaceOptions } from '../models/interfaces';
import { DBConfig } from '../utils/db-config';
import { TaskError } from '../utils/errors';
import { fileOperations } from './file-operations';
import { helpers } from './helpers';

export function createDB(config: DBConfig) {

    let database: DBData;
    let databaseFilePath: string;

    function areValuesUnique(collectionName: string, data: Entry, uniqueFields: string[]): void {
        if (database[collectionName].length === 0) {
            return;
        }

        uniqueFields.forEach((field) => {
            // TODO: Add functionality for nested objects
            // 'field'.split('.').reduce((o,i) => o[i], data);
            // Add verification to that array length === 1 is not nested object
            // and return when undefined occur instead of error
            // TODO: verify that value is primitive

            // if (!data[field]) {
            //     return;
            // }

            let insertedValue: unknown;

            try {
                insertedValue = field.split('.').reduce((o, i) => o[i], data);
            } catch (e) {
                console.warn(`Value for field: ${field} not found`);
                insertedValue = undefined;
            }

            database[collectionName].forEach((entry) => {
                if (entry[field] && entry[field] === data[field]) {
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

    function insert(collectionName: string, data: object, options?: InsertOptions): number {
        isDatabaseOpen();

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
        entry['_modifiedAt'] = null;

        database[collectionName].push(entry);

        isDatabaseSizeNotExceeded();

        return entryId;
    }

    function find(collectionName: string, query: Query[], options?: FindOptions): Entry[] {
        isDatabaseOpen();
        doesCollectionExists(collectionName);

        // TODO: Filter entries
        // TODO: Sort results
        // TODO: Paginate results

        return [];
    }

    function replace(collectionName: string, query: Query[], data: object, options?: ReplaceOptions): number {

        isDatabaseOpen();
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
    }

    function remove(collectionName: string, query: Query[]): number {
        isDatabaseOpen();
        doesCollectionExists(collectionName);

        const entryId = helpers.findEntryId(database[collectionName], query);

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
            database = await fileOperations.read(path, config.dbSize);
            // verifyDBSchema
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
            // verifyDBSchema
            await fileOperations.write(databaseFilePath, database, config.dbSize);
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