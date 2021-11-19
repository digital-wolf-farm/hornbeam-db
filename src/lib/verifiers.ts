import { DBTaskError } from '../models/enums';
import { DBData } from '../models/interfaces';
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
    isDatabaseSchemaValid,
};
