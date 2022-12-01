import { Entry } from '..';
import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';
import { collectionValidators } from './collection-validators';
import { entryValidators } from './entry-validators';
import { typesValidators } from './types-validators';

const isDatabaseSchemaValid = (db: unknown): void => {
    if (!typesValidators.isObject(db)) {
        throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Database is not an object.');
    }

    try {
        Object.keys(db).forEach((collectionName) => {
            collectionValidators.isCollectionNameValid(collectionName);
        });
    } catch (e) {
        throw new InternalError(DatabaseError.DatabaseSchemaMismatch, e.message);
    }

    Object.values(db).forEach((collection) => {
        if (!typesValidators.isArray(collection)) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, `Collection is not an array.`);
        }

        if (collection.length === 0) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Collection must contain at least one entry.');
        }

        try {
            collection.forEach((entry: unknown) => {
                entryValidators.isEntryValid(entry);
            });
        } catch (e) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, e.message);
        }

        // TODO: Fix type
        const idsArray = (collection as Entry[]).map((entry) => entry['_id']);

        if (new Set(idsArray).size !== idsArray.length) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Entry _id is not unique.');
        }
    });
};

const isDatabaseSizeNotExceeded = (data: unknown, sizeLimit: number): void => {
    let size: number;

    if (typeof data === 'string') {
        size = Buffer.byteLength(data);
    } else {
        size = Buffer.byteLength(JSON.stringify(data));
    }

    if ((size / (1024 * 1024)) >= sizeLimit) {
        throw new InternalError(DatabaseError.DatabaseSizeExceeded, `Database size exceeds limit: ${sizeLimit}MB`);
    }
};

const isFilePathValid = (path: string): void => {
    if (typeof path !== 'string' ) {
        throw new InternalError(DatabaseError.FilePathError, 'Database file path is not a string.');
    }

    if (!/^(?:[a-z]:)?[/\\]{0,2}(?:[./\\ ](?![./\\\n])|[^<>:"|?*./\\ \n])+$/i.test(path)) {
        throw new InternalError(DatabaseError.FilePathError, 'Database file path is invalid.');
    }
};

const isSizeLimitValid = (size: number): boolean => {
    if (!size || typeof size !== 'number' || !typesValidators.isPositiveInteger(size) || size > 1000) {
        return false;
    }

    return true;
};

export const databaseValidators = {
    isDatabaseSchemaValid,
    isDatabaseSizeNotExceeded,
    isSizeLimitValid,
    isFilePathValid
};
