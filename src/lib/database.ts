import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, CollectionOptions, Database, DatabaseAPI, DatabaseInfo, DatabaseStats, Entry } from '../models/interfaces';
import { CustomError, InternalError } from '../utils/errors';
import { collectionValidators } from '../validators/collection-validators';
import { databaseValidators } from '../validators/database-validators';
import { collection } from './collection';
import { fileSystem } from './file-system';

export const database = (data: Database, options: DatabaseInfo): DatabaseAPI => {

    let db = data;
    let dbFilePath = options.path;

    const calculateDataSize = (): string => {
        return (Buffer.byteLength(JSON.stringify(db)) / (1024 * 1024)).toFixed(2);
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
        try {
            if (typeof name !== 'string') {
                throw new InternalError(DatabaseError.FunctionArgumentMismatch, 'Collection name is not a string.');
            }

            if (!collectionValidators.isCollectionNameValid(name)) {
                throw new InternalError(DatabaseError.FunctionArgumentMismatch, 'Invalid collection name.');
            }

            if (options && !collectionValidators.isCollectionOptionsValid(options)) {
                throw new InternalError(DatabaseError.FunctionArgumentMismatch, 'Invalid collection options.');
            }

            if (!db[name]) {
                db[name] = [];
            }

            return collection(db[name], options?.indexes);
        } catch (e) {
            throw new CustomError(e.name, DBMethod.GetCollection, e.message);
        }

    };

    const getStats = (): DatabaseStats => {
        try {
            return {
                sizeLimit: options.dbSizeLimit.toFixed(2),
                inUse: calculateDataSize()
            };
        } catch (e) {
            throw new CustomError(e.name, DBMethod.StatDB, e.message);
        }

    };

    const saveData = async (): Promise<void> => {
        try {
            cleanupDatabase();
            databaseValidators.isDatabaseSizeNotExceeded(db, options.dbSizeLimit);
            databaseValidators.isDatabaseSchemaValid(db);

            await fileSystem.write(dbFilePath, db);
        } catch (e) {
            throw new CustomError(e.name, DBMethod.SaveDB, e.message);
        }

    };

    return {
        getCollection,
        getStats,
        saveData
    };
};
