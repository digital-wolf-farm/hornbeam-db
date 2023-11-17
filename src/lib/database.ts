import { DatabaseError, DBMethod } from '../models/enums';
import { Collection, HornbeamData, HornbeamAPI } from '../models/interfaces';
import { HornbeamError, InternalError } from '../utils/errors';
import { dataValidators } from '../validators/data-validators';
import { collection } from './collection';

export const database = (data: HornbeamData): HornbeamAPI => {

    const getCollection = (name: string, uniqueField?: string): Collection => {
        try {
            if (typeof name !== 'string') {
                throw new InternalError(DatabaseError.CollectionNameError, 'Collection name is not a string');
            }

            if (name.length > 16) {
                throw new InternalError(DatabaseError.CollectionNameError, 'Collection name is longer than 16 characters');
            }

            if (uniqueField && typeof uniqueField !== 'string') {
                throw new InternalError(DatabaseError.CollectionOptionsError, 'Unique field is not a string');
            }

            if (!data[name]) {
                data[name] = [];
            }

            return collection(data[name], uniqueField);
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.GetCollection, e.message);
        }
    };

    const exportData = (): HornbeamData => {
        try {
            for (const collection in data) {
                if (Object.prototype.hasOwnProperty.call(data, collection) && data[collection].length === 0) {
                    delete data[collection];
                }
            }

            dataValidators.isDataSchemaValid(data);

            return data;
        } catch (e) {
            throw new HornbeamError(e.name, DBMethod.ExportData, e.message);
        }
    };

    return {
        getCollection,
        exportData
    };
};
