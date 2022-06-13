import { DBTaskError } from '../models/enums';
import { DBConfig } from '../utils/db-config';
import { TaskError } from '../utils/errors';
import { typeGuards } from './type-guards';
import { validators } from './validators';

function validate(db: unknown, config: DBConfig): void {

    if (!typeGuards.isObject(db)) {
        throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Database must be an object.');
    }

    const collectionsName = Object.keys(db);

    if (collectionsName.length === 0) {
        return;
    }

    collectionsName.forEach((name) => {
        if (!validators.validateCollectionName(name, config.collectionNameMinLength, config.collectionNameMaxLength)) {
            throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Collection name must be valid string.');
        }
    });

    const collections = Object.values(db);

    collections.forEach((collection) => {
        if (!typeGuards.isArray(collection)) {
            throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Collection must be an array of entries.');
        }

        collection.forEach((entry: unknown) => {
            if (!typeGuards.isObject(entry)) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must be an object.');
            }

            if(!entry['_id'] || !typeGuards.isPositiveInteger(entry['_id'])) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must contain field _id with positive integer value.');
            }

            if (Object.keys(entry).length < 2) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must contain at least 1 custom fields.');
            }
        });

        const idsArray = collection.map((entry) => entry['_id']);

        if (new Set(idsArray).size !== idsArray.length) {
            throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Every entry within collection has to have unique id.');
        }
    });
}

export const dbSchemaValidator = { validate };
