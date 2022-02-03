import { DBAPI, FindResults } from './models/interfaces';
import { DBConfig } from './utils/db-config';
import { DBMethod, DBTaskError } from './models/enums';
import { MethodError, TaskError } from './utils/errors';
import { typeGuards } from './lib/type-guards';
import { createDB } from './lib/database';
import { validators } from './lib/validators';

export default function hornbeamDB(configuration?: DBConfig): DBAPI {

    let config: DBConfig = configuration instanceof DBConfig ? configuration : new DBConfig();
    let db = createDB(config);

    function insert(collectionName: unknown, data: unknown, options?: unknown): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.');
            }

            if (!typeGuards.isObject(data)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Data argument must be an object.');
            }

            if (options !== undefined && !typeGuards.isInsertOptionsObject(options)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Options argument must be a valid object.');
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.insert(collectionName, data, options);
        } catch (e) {
            db.close();
            throw new MethodError(DBMethod.AddEntry, e.error, e.message);
        }
    }

    function find(collectionName: unknown, query: unknown, options?: unknown): FindResults {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.')
            }

            if (!typeGuards.isQueryArray(query)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Query argument must be an empty array or array of valid queries.')
            }

            if (options !== undefined && !typeGuards.isFindOptionsObject(options)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Options argument must be a valid options object.')
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

    function findById(collectionName: unknown, id: unknown): FindResults {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.')
            }

            if (!typeGuards.isNumber(id)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Id argument must be a number.')
            }

            return db.find(collectionName, [{ type: 'eq', field: '_id', value: id }]);
        } catch (e) {
            db.close();
            throw new MethodError(DBMethod.FindEntries, e.error, e.message);
        }
    }

    function replace(collectionName: unknown, query: unknown, data: unknown, options?: unknown): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.')
            }

            if (!typeGuards.isQueryArray(query)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Query argument must be an array of valid queries.')
            }

            if (!typeGuards.isObject(data)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Data argument must be an object.')
            }

            if (options !== undefined && !typeGuards.isReplaceOptionsObject(options)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Options argument must be an object.')
            }

            if (!validators.validateCollectionName(collectionName, config.collectionNameMinLength, config.collectionNameMaxLength )) {
                throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
            }

            return db.replace(collectionName, query, data, options);
        } catch (e) {
            db.close();
            throw new MethodError(DBMethod.ReplaceEntry, e.error, e.message);
        }
    }

    function remove(collectionName: unknown, query: unknown): number {
        try {
            if (!typeGuards.isString(collectionName)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Collection name argument must be a string.')
            }

            if (!typeGuards.isQueryArray(query)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Query argument must be an array of valid queries.')
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

    async function open(path: unknown): Promise<void> {
        try {
            if (!typeGuards.isString(path)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Path argument must be a string.')
            }

            if (!validators.validatePath(path)) {
                throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Path to database file is not valid.');
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

    function stat(): any {
        try {
            return db.stat();
        } catch (e) {
            throw new MethodError(DBMethod.StatDB, e.error, e.message);
        }
    }

    // TODO: [Improvement]: Add export/import methods

    return {
        insert,
        find,
        findById,
        replace,
        remove,
        open,
        save,
        close,
        stat
    };
}
