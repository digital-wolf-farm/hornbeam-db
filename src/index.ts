import { database } from './lib/database';
import { DBMethod } from './models/enums';
import { HornbeamError } from './utils/errors';
import { dataValidators } from './validators/data-validators';
import { Query } from './models/types';
import {
    DatabaseAPI, DatabaseData, DatabaseStats,
    Collection,
    FindResults, LimitMethods, SortMethods, FindMethods,
    NewEntry, Entry
} from './models/interfaces';

export const openDatabase = (data: DatabaseData, dataSizeLimit?: number): DatabaseAPI => {
    try {
        if (dataSizeLimit) {
            dataValidators.isSizeLimitValid(dataSizeLimit);
            dataValidators.isDataSizeNotExceeded(data, dataSizeLimit);
        }

        dataValidators.isDataSchemaValid(data);

        return database(data, dataSizeLimit);
    } catch (e) {
        throw new HornbeamError(e.name, DBMethod.OpenDB, e.message);
    }
};

export {
    DatabaseAPI, DatabaseData, DatabaseStats,
    Collection,
    Query,
    FindResults, LimitMethods, SortMethods, FindMethods,
    NewEntry, Entry
}
