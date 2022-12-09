import { DBMethod } from '../models/enums';
import { Collection, CollectionOptions, DatabaseData, DatabaseAPI, DatabaseStats, Entry } from '../models/interfaces';
import { HornbeamError } from '../utils/errors';
import { collectionValidators } from '../validators/collection-validators';
import { dataValidators } from '../validators/data-validators';
import { collection } from './collection';

export const database = (data: DatabaseData, dataSizeLimit: number): DatabaseAPI => {

    let db = data;

    const calculateDataSize = (): string => {
        return (Buffer.byteLength(JSON.stringify(db)) / (1024 * 1024)).toFixed(2);
    };

    const cleanupDatabase = (): void => {
        for (const collection in db) {
            if (Object.prototype.hasOwnProperty.call(db, collection) && db[collection].length === 0) {
                delete db[collection];
            }
        }
    };

    const getCollection = (name: string, options?: CollectionOptions): Collection => {
        try {
            collectionValidators.isCollectionNameValid(name);

            if (options) {
                collectionValidators.isCollectionOptionsValid(options)
            }

            if (!db[name]) {
                db[name] = [];
            }

            return collection(db[name], options?.indexes);
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.GetCollection, e.message);
        }

    };

    const getStats = (): DatabaseStats => {
        try {
            return {
                sizeLimit: dataSizeLimit.toString() ?? '',
                inUse: calculateDataSize()
            };
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.StatDB, e.message);
        }

    };

    const returnData = (): DatabaseData => {
        try {
            cleanupDatabase();
            if (dataSizeLimit) {
                dataValidators.isDataSizeNotExceeded(db, dataSizeLimit);
            }
            dataValidators.isDataSchemaValid(db);

            return db;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.SaveDB, e.message);
        }

    };

    return {
        getCollection,
        getStats,
        returnData
    };
};
