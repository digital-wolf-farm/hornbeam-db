import { DatabaseError } from '../models/enums';
import { Collection, CollectionIndexes, CollectionOptions, Database, DatabaseAPI, DatabaseInfo, DatabaseStats, Entry } from '../models/interfaces';
import { CustomError } from '../utils/errors';
import { utils } from '../utils/utils';
import { collectionValidators } from '../validators/collection-validators';
import { databaseValidators } from '../validators/database-validators';
import { collection } from './collection';
import { fileSystem } from './file-system';

export const database = (data: Database, options: DatabaseInfo): DatabaseAPI => {

    let db = data;
    let dbFilePath = options.path;

    const calculateDataSize = (): string => {
        return (Buffer.byteLength(JSON.stringify(data)) / (1024 * 1024)).toFixed(2);
    };

    const cleanupDatabase = (): void => {
        for (const collection in db) {
            if (Object.prototype.hasOwnProperty.call(db, collection)) {
                if (collection.length === 0) {
                    delete db[collection];
                }
            }
        }
    };

    const getCollection = (name: string, options?: CollectionOptions): Collection => {
        if (typeof name !== 'string') {
            throw new CustomError(DatabaseError.DatabaseSchemaMismatch, 'Collection name is not a string.');
        }

        if (!collectionValidators.isCollectionNameValid(name)) {
            throw new CustomError(DatabaseError.DatabaseSchemaMismatch, 'Invalid collection name.');
        }

        if (options && !collectionValidators.isCollectionOptionsValid(options)) {
            throw new CustomError(DatabaseError.DatabaseSchemaMismatch, 'Invalid collection options.');
        }

        if (!db[name]) {
            db[name] = [];
        }

        return collection(db[name], options?.indexes);
    };

    const getStats = (): DatabaseStats => {
        return {
            limit: options.dbSizeLimit.toFixed(2),
            usage: calculateDataSize()
        };
    };

    const saveData = async (): Promise<void> => {
        cleanupDatabase();
        databaseValidators.isDatabaseSizeNotExceeded(db, options.dbSizeLimit);
        databaseValidators.isDatabaseSchemaValid(db);

        await fileSystem.write(dbFilePath, db);
    };

    return {
        getCollection,
        getStats,
        saveData
    };
};
