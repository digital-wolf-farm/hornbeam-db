import { Entry } from '..';
import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';
import { entryValidators } from './entry-validators';
import { typesValidators } from './types-validators';

const isDataSchemaValid = (db: unknown): void => {
    if (!typesValidators.isObject(db)) {
        throw new InternalError(DatabaseError.DataSchemaMismatch, 'Data is not an object');
    }

    try {
        Object.keys((db as Record<string | number | symbol, unknown>)).forEach((collectionName) => {
            typeof collectionName === 'string';
        });
    } catch (e) {
        throw new InternalError(DatabaseError.DataSchemaMismatch, e.message);
    }

    Object.values((db as Record<string | number | symbol, unknown>)).forEach((collection) => {
        if (!Array.isArray(collection)) {
            throw new InternalError(DatabaseError.DataSchemaMismatch, 'Collection is not an array');
        }

        try {
            (collection as unknown[]).forEach((entry: unknown) => {
                entryValidators.isEntryValid(entry, false);
            });
        } catch (e) {
            throw new InternalError(DatabaseError.DataSchemaMismatch, e.message);
        }

        const idsArray = (collection as Entry[]).map((entry) => entry['_id']);

        if (new Set(idsArray).size !== idsArray.length) {
            throw new InternalError(DatabaseError.DataSchemaMismatch, 'Entry _id is not unique');
        }
    });
};

// const isDataSizeNotExceeded = (data: unknown, sizeLimit: number): void => {
//     let size: number;

//     if (typeof data === 'string') {
//         size = Buffer.byteLength(data);
//     } else {
//         size = Buffer.byteLength(JSON.stringify(data));
//     }

//     if ((size / (1024 * 1024)) >= sizeLimit) {
//         throw new InternalError(DatabaseError.DataSizeExceeded, `Database size exceeds limit: ${sizeLimit}MB`);
//     }
// };

// const isSizeLimitValid = (size: unknown): boolean => {
//     if (typeof size !== 'number' || !typesValidators.isPositiveInteger(size)) {
//         throw new InternalError(DatabaseError.DataSizeLimitFormatError, 'Data size limit is not a positive integer');
//     }

//     if (size > 1000) {
//         throw new InternalError(DatabaseError.DataSizeLimitFormatError, 'Data size limit exceeds 1000MB');
//     }

//     return true;
// };

export const dataValidators = {
    isDataSchemaValid,
    // isDataSizeNotExceeded,
    // isSizeLimitValid
};
