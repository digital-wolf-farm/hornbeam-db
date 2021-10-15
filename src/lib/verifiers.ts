import { DBTaskError } from '../enums/db-task-error';
import { DB } from '../interfaces/db';
import { TaskError } from '../utils/errors';

function isDatabaseOpen(database: DB): void {
    if (!database) {
        throw new TaskError(DBTaskError.DatabaseNotOpen, 'Database must be open before this operation');
    }
}

function isDatabaseSchemaValid(parsedContent: any): void {
    if (!isObject(parsedContent)) {
        throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Database must be an object');
    }

    for (let property in parsedContent) {
        if (parsedContent.hasOwnProperty(property)) {
            if (!Array.isArray(parsedContent[property])) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Collection must be an array');
            }

            for (let entry of parsedContent[property]) {
                if (!isObject(entry)) {
                    throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must be an object');
                }
            }
        }
    }
}

function isObject(data: any): boolean {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return false;
    }

    return true;
}

function isPathValid(path: string): void {
    if (typeof path !== 'string') {
        throw new TaskError(DBTaskError.FunctionArgumentTypeMismatch, 'Path to database file must be a string');
    }
    
    if (!/^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+$/i.test(path)) {
        throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Path to database file is not valid');
    }
}

export const verifiers = {
    isDatabaseOpen,
    isDatabaseSchemaValid,
    isPathValid
};
