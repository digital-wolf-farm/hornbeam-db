import { DBTaskError } from '../models/enums';
import { Entry, DBData, CollectionNameConfig } from '../models/interfaces';
import { TaskError } from '../utils/errors';

function areBasicValueEqual(baseValue: unknown, comparedValue: unknown): boolean {
    if (isPrimitive(baseValue) && isPrimitive(comparedValue)) {
        return baseValue == comparedValue;
    } else if (isDate(baseValue) && isDate(comparedValue)) {
        return (baseValue as Date).getTime() === (comparedValue as Date).getTime();
    } else if ((isDate(baseValue) && isPrimitive(comparedValue)) || isPrimitive(baseValue) && isDate(comparedValue)) {
        return false;
    } else {
        throw new TaskError(DBTaskError.DataTypeMismatch, 'Provided values are not basic types or have different types');
    }
}

function isCollectionNameValid(name: string, config: CollectionNameConfig): void {
    const regexString = `^([a-z][a-z0-9-_]{${config.minLength - 1},${config.maxLength - 1}})$`;
    const collectionNameRegex = new RegExp(regexString, 'g');

    if (!collectionNameRegex.test(name)) {
        throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
    }
}

// TODO: Add optional argument to enable deep verify schema of db (eg. _id, _createdAt fields)
function isDatabaseSchemaValid(parsedContent: DBData): void {
    if (!isObject(parsedContent)) {
        throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Database must be an object.');
    }

    for (const property in parsedContent) {
        if (Object.prototype.hasOwnProperty.call(parsedContent, property)) {
            if (!Array.isArray(parsedContent[property])) {
                throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Collection must be an array.');
            }

            for (const entry of parsedContent[property]) {
                if (!isObject(entry)) {
                    throw new TaskError(DBTaskError.DatabaseSchemaMismatch, 'Entry must be an object.');
                }
            }
        }
    }
}

// TODO: decide if leave or just overwrite properties listed below
function isDataValid(entry: Entry, isNewEntry: boolean): void {
    if (isNewEntry) {
        if (entry['_id'] || entry['_createdAt'] || entry['_modifiedAt']) {
            throw new TaskError(DBTaskError.DataValidationError, 'Added entry cannot contain any of properties: "_id", "_createdAt", "_modifiedAt"');
        }
    }
}

function isDate(data: unknown): boolean {
    if (Object.prototype.toString.call(data) === "[object Date]" && !isNaN(data as number)) {
        return true;
    }

    return false;
}

function isObject(data: object): boolean {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return false;
    }

    return true;
}

function isPathValid(path: string): void {
    if (!/^(?:[a-z]:)?[/\\]{0,2}(?:[./\\ ](?![./\\\n])|[^<>:"|?*./\\ \n])+$/i.test(path)) {
        throw new TaskError(DBTaskError.FunctionArgumentMismatch, 'Path to database file is not valid.');
    }
}

function isPrimitive(data: unknown): boolean {
    if (data === null) {
        return true;
    }

    if (typeof data === 'object' || typeof data === 'function') {
        return false;
    } else {
        return true;
    }
}

export const verifiers = {
    areBasicValueEqual,
    isCollectionNameValid,
    isDatabaseSchemaValid,
    isDataValid,
    isPathValid
};
