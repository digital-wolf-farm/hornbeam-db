import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';
import { basicTypesValidators } from './basic-types-validators';
import { collectionValidators } from './collection-validators';

const isDatabaseSchemaValid = (db: unknown): void => {
    if (!basicTypesValidators.isObject(db)) {
        throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Database is not an object.');
    }

    Object.keys(db).forEach((collectionName) => {
        if (!collectionValidators.isCollectionNameValid(collectionName)) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, `Invalid collection name: ${collectionName}.`);
        }
    });

    Object.values(db).forEach((collection) => {
        if (!basicTypesValidators.isArray(collection)) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, `Collection is not an array.`);
        }

        if (collection.length === 0) {
            throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Collection must contain at least one entry.');
        }

        collection.forEach((entry: unknown) => {
            if (!basicTypesValidators.isObject(entry)) {
                throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Entry is not an object.');
            }

            if(!entry['_id']) {
                throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Entry _id field missing..');
            }

            if(!basicTypesValidators.isPositiveInteger(entry['_id'])) {
                throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Entry _id field is not a positive integer.');
            }

            if (Object.keys(entry).length < 2) {
                throw new InternalError(DatabaseError.DatabaseSchemaMismatch, 'Entry must contain at least one custom field.');
            }
        });

        const idsArray = collection.map((entry) => entry['_id']);

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
        throw new InternalError(DatabaseError.FunctionArgumentMismatch, 'Database file path is not a string.');
    }

    if (!/^(?:[a-z]:)?[/\\]{0,2}(?:[./\\ ](?![./\\\n])|[^<>:"|?*./\\ \n])+$/i.test(path)) {
        throw new InternalError(DatabaseError.FunctionArgumentMismatch, 'Database file path is invalid.');
    }
};

const isSizeLimitValid = (size: number): boolean => {
    if (!size || typeof size !== 'number' || !basicTypesValidators.isPositiveInteger(size) || size > 1000) {
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
