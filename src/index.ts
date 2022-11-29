import { database } from './lib/database';
import { fileSystem } from './lib/file-system';
import { DatabaseError, DBMethod } from './models/enums';
import { CustomError } from './utils/errors';
import { databaseValidators } from './validators/database-validators';

import {
    DatabaseAPI, DatabaseInfo, Database, DatabaseStats,
    Collection, CollectionOptions, CollectionIndexes,
    Query,
    FindResults, LimitMethods, SortMethods, FindMethods,
    NewEntry, Entry
} from './models/interfaces';

export const openDB = async (path: string, sizeLimit?: number): Promise<DatabaseAPI> => {
    let dbSizeLimit: number = databaseValidators.isSizeLimitValid(sizeLimit) ? sizeLimit : 10;

    try {
        databaseValidators.isFilePathValid(path);
        const loadedData = await fileSystem.read(path);
        databaseValidators.isDatabaseSizeNotExceeded(loadedData, dbSizeLimit);
        databaseValidators.isDatabaseSchemaValid(loadedData);

        return database(loadedData as Database, { path, dbSizeLimit });
    } catch (e) {
        if (e.name === DatabaseError.FileNotFound) {
            return database({}, { path, dbSizeLimit });
        } else {
            throw new CustomError(e.name, DBMethod.OpenDB, e.message);
        }
    }
};

export {
    DatabaseAPI, DatabaseInfo, Database, DatabaseStats,
    Collection, CollectionOptions, CollectionIndexes,
    Query,
    FindResults, LimitMethods, SortMethods, FindMethods,
    NewEntry, Entry
}
