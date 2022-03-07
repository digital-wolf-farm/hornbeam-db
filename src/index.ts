import { DBAPI, Entry, FindResults, NewEntry, Query } from './models/interfaces';
import { DBConfig } from './utils/db-config';
import { DBMethod, DBTaskError, FilterType } from './models/enums';
import { MethodError, TaskError } from './utils/errors';
import { typeGuards } from './lib/type-guards';
import { createDB } from './lib/database';
import { validators } from './lib/validators';

export default function hornbeamDB(configuration?: DBConfig): DBAPI {

    const config: DBConfig = configuration instanceof DBConfig ? configuration : new DBConfig();
    const db = createDB(config);

    async function open(path: string): Promise<void> {
        try {
            if (!typeGuards.isString(path) || !validators.validatePath(path)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Function argument must be a valid path string.');
            }

            await db.open(path);
        } catch (e) {
            throw new MethodError(DBMethod.OpenDB, e.error, e.message);
        }
    }

    async function save(): Promise<void> {
        try {
            await db.save();
        } catch (e) {
            throw new MethodError(DBMethod.SaveDB, e.error, e.message);
        }
    }

    function close(): void {
        db.close();
    }

    function stats(): string {
        try {
            return db.stats();
        } catch (e) {
            throw new MethodError(DBMethod.StatDB, e.error, e.message);
        }
    }

    function insert(collectionName: string, data: NewEntry, uniqueFields?: string[]): number {
        try {
            if (
                !typeGuards.isString(collectionName) ||
                !validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )
            ) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name must be a string containing only letters, numbers, hyphens and underscores.');
            }

            if (!typeGuards.isNewEntry(data)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Data argument must be an object withoud \'_id\' property.');
            }

            if (uniqueFields !== undefined && !typeGuards.isUniqueFieldsArray(uniqueFields)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Unique fields argument must be array of valid strings.');
            }

            return db.insert(collectionName, data, uniqueFields);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function find(collectionName: unknown, query: unknown, options?: unknown): FindResults {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isQueryArray(query)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Query argument must be an empty array or array of valid queries.');
            }

            if (options !== undefined && !typeGuards.isFindOptionsObject(options)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Options argument must be a valid options object.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.find(collectionName, query, options);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function findById(collectionName: unknown, id: unknown): Entry {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isPositiveInteger(id)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Id argument must be an integer greater than 0.');
            }

            return db.find(collectionName, [{ type: FilterType.Equal, field: '_id', value: id }]).data[0];
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function replace(collectionName: unknown, query: Query[], data: unknown, uniqueFields?: string[]): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isEntry(data)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Data argument must be an object.');
            }

            if (uniqueFields !== undefined && !typeGuards.isUniqueFieldsArray(uniqueFields)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Unique fields argument must be array of valid strings.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.replace(collectionName, [], data, uniqueFields);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.ReplaceEntry, e.error, e.message);
        }
    }

    function replaceById(collectionName: unknown, id: unknown, data: unknown, uniqueFields?: string[]): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isPositiveInteger(id)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Id argument must be an integer greater than 0.');
            }

            if (!typeGuards.isEntry(data)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Data argument must be an object.');
            }

            if (uniqueFields !== undefined && !typeGuards.isUniqueFieldsArray(uniqueFields)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Unique fields argument must be array of valid strings.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.replace(collectionName, [], data, uniqueFields);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.ReplaceEntry, e.error, e.message);
        }
    }

    function remove(collectionName: unknown, query: Query[]): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.remove(collectionName, query);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.RemoveEntry, e.error, e.message);
        }
    }

    function removeById(collectionName: unknown, id: unknown): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isPositiveInteger(id)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Id argument must be an integer greater than 0.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.remove(collectionName, []);
        } catch (e) {
            db.close();

            throw new MethodError(DBMethod.RemoveEntry, e.error, e.message);
        }
    }

    return {
        open,
        save,
        close,
        stats,
        insert,
        find,
        findById,
        replace,
        replaceById,
        remove,
        removeById 
    };
}
