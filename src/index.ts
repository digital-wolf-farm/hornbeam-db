import { database } from './lib/database';
import { fileSystem } from './lib/file-system';
import { DatabaseError } from './models/enums';
import { Client, Database, DatabaseAPI } from './models/interfaces';
import { databaseValidators } from './validators/database-validators';

export const createDbClient = (sizeLimitInMB?: number): Client => {
    let dbSizeLimit: number = databaseValidators.isSizeLimitValid(sizeLimitInMB) ? sizeLimitInMB : 10;

    const open = async (path: string): Promise<DatabaseAPI> => {
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
                throw e;
            }
        }
    };

    return { open };
};
