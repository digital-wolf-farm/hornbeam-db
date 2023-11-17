import { database } from './lib/database';
import { DBMethod } from './models/enums';
import { HornbeamError } from './utils/errors';
import { dataValidators } from './validators/data-validators';
import { Query } from './models/types';
import {
    HornbeamAPI, HornbeamData,
    Collection,
    FindResults, LimitMethods, SortMethods, FindMethods,
    InsertedEntry, Entry
} from './models/interfaces';

const loadData = (data: HornbeamData): HornbeamAPI => {
    try {
        dataValidators.isDataSchemaValid(data);

        return database(data);
    } catch (e) {
        throw new HornbeamError(e.name, DBMethod.LoadData, e.message);
    }
};

export const hornbeamDb = {
    loadData
};

export {
    HornbeamAPI, HornbeamData,
    Collection,
    Query,
    FindResults, LimitMethods, SortMethods, FindMethods,
    InsertedEntry, Entry
}
