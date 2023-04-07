import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, DatabaseData, DatabaseAPI, DatabaseStats } from '../models/interfaces';
import { HornbeamError, InternalError } from '../utils/errors';
import { collectionValidators } from '../validators/collection-validators';
import { dataValidators } from '../validators/data-validators';
import { typesValidators } from '../validators/types-validators';
import { collection } from './collection';

export const database = (data: DatabaseData, dataSizeLimit?: number): DatabaseAPI => {

    let db = data;

    const calculateDataSize = (): string => {
        return (Buffer.byteLength(JSON.stringify(db)) / (1024 * 1024)).toFixed(2);
    };

    const cleanUpDatabase = (): void => {
        for (const collection in db) {
            if (Object.prototype.hasOwnProperty.call(db, collection) && db[collection].length === 0) {
                delete db[collection];
            }
        }
    };

    const getCollection = (name: string, indexes?: string[]): Collection => {
        try {
            if (!typesValidators.isString(name)) {
                throw new InternalError(DatabaseError.CollectionNameError, 'Collection name is not a string');
            }

            if (indexes) {
                collectionValidators.isCollectionIndexesListValid(indexes);
            }

            if (!db[name]) {
                db[name] = [];
            }

            return collection(db[name], indexes);
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.GetCollection, e.message);
        }
    };

    const getStats = (): DatabaseStats => {
        try {
            return {
                sizeLimit: dataSizeLimit ? dataSizeLimit.toString() : '',
                inUse: calculateDataSize()
            };
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.StatDB, e.message);
        }
    };

    const returnData = (): DatabaseData => {
        try {
            cleanUpDatabase();

            if (dataSizeLimit) {
                dataValidators.isDataSizeNotExceeded(db, dataSizeLimit);
            }

            dataValidators.isDataSchemaValid(db);

            return db;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.ReturnDB, e.message);
        }
    };

    return {
        getCollection,
        getStats,
        returnData
    };
};
