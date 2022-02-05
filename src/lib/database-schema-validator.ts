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

            const fields = Object.keys(entry);

            if(!['_id', '_created', '_modified'].every((metadataField) => fields.includes(metadataField))) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must contain mandatory fields: _id, _created, _modified.');
            }

            if (fields.length < 4) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must contain at least 4 fields.');
            }

            if (!Number.isInteger(entry['_id']) || entry['_id'] < 1) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Field _id must be an integer greater or equal to 1.');
            }

            if (!Number.isInteger(entry['_created'])) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Field _created must be a valid timestamp.');
            }

            if (!Number.isInteger(entry['_modified']) || entry['_modified'] != null) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Field _created must be a valid timestamp.');
            }
        });
    });
}

export const dbSchemaValidator = {
    validate
}
