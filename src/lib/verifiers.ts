import { DBTaskError } from '../enums/db-task-error';
import { DB } from '../models/db';
import { Entry } from '../models/entry';
import { TaskError } from '../utils/errors';
import { filters } from './filters';

function areAddOptionsValid(options: any): void {
    if (!isObject(options)) {
        throw new TaskError(DBTaskError.OptionsSchemaMismatch, 'Options argument must be an object.');
    }

    const optionsList = Object.keys(options);

    if (optionsList.length === 0) {
        throw new TaskError(DBTaskError.OptionsSchemaMismatch, 'Options object cannot be empty.');
    }

    const allowedProperties = ['unique'];
    if (!isEveryElementListed(optionsList, allowedProperties)) {
        throw new TaskError(DBTaskError.OptionsSchemaMismatch, 'Options object can contain only allowed properties.');
    }

    // TODO: Fix this part of code: if unique is present it must be non-empty array with strings only
    if (
        options['unique'] &&
        !Array.isArray(options['unique']) &&
        options['unique'].length > 0 &&
        !areArrayElementsProperType(options['unique'], 'string')
    ) {
        throw new TaskError(DBTaskError.OptionsSchemaMismatch, '"Unique" property of options object must be non-empty array with strings.');
    }
}

function areArrayElementsProperType(array: unknown[], type: string): boolean {
    let isTypeValid = true;

    array.forEach((element) => {
        if (type === 'string' || type === 'number' || type === 'boolean') {
            if (typeof element !== type) {
                isTypeValid = false;
            }
        } else {
            console.warn('Attempt to verify array element for not handled type.');
        }
    });

    return isTypeValid;
}

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

function isCollectionNameValid(name: string, config: any): void {
    if (typeof name !== 'string') {
        throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name must be a string.');
    }

    // TODO: Fix regex to accept only lowercase letter, numbers, -, _ and must starts with letter
    const regexString = `^([\\w-]{${config.minLength},${config.maxLength}})$`;
    const collectionNameRegex = new RegExp(regexString, 'g');

    if (!collectionNameRegex.test(name)) {
        throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores.');
    }
}

function isDatabaseSchemaValid(parsedContent: DB): void {
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

function isDataValid(entry: Entry, isNewEntry: boolean, config: any): void {
    if (!isObject(entry)) {
        throw new TaskError(DBTaskError.DataValidationError, 'Added data must be an object.');
    }

    if (isNewEntry) {
        if (entry['_id'] || entry['_createdAt'] || entry['_modifiedAt']) {
            throw new TaskError(DBTaskError.DataValidationError, 'Added entry cannot contain any of properties: "_id", "_createdAt", "_modifiedAt"');
        }
    }

    const entrySize = (Buffer.byteLength(JSON.stringify(entry)) / (1024 * 1024)).toFixed(2);

    if (entrySize > config.sizeLimit) {
        throw new TaskError(DBTaskError.DataValidationError, `Added entry weights ${entrySize}MB (limit is ${config.sizeLimit}MB)`);
    }
}

function isDate(data: unknown): boolean {
    if (Object.prototype.toString.call(data) === "[object Date]" && !isNaN(data as number)) {
        return true;
    }

    return false;
}

function isEveryElementListed(verifiedArray: string[], referenceArray: string[]): boolean {
    let isListValid = true;

    verifiedArray.forEach((element) => {
        if (referenceArray.findIndex((refElement) => refElement === element) === -1) {
            isListValid = false;
        }
    });

    return isListValid;
}

function isObject(data: object): boolean {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return false;
    }

    return true;
}

function isPathValid(path: string): void {
    if (typeof path !== 'string') {
        throw new TaskError(DBTaskError.FunctionArgumentTypeMismatch, 'Path to database file must be a string.');
    }

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

function isQueryValid(queriesArray: unknown): boolean {
    if (queriesArray === undefined) {
        return true;
    }

    if (!Array.isArray(queriesArray)) {
        throw new TaskError(DBTaskError.QuerySchemaMismatch, 'Query argument must be an array.');
    }

    const allowedProperties = ['type', 'field', 'value'];

    queriesArray.forEach((query) => {
        if (!isEveryElementListed(Object.keys(query), allowedProperties)) {
            throw new TaskError(DBTaskError.QuerySchemaMismatch, 'Query object can contain only allowed properties.');
        }

        const filterTypes = Object.keys(filters);

        if (filterTypes.findIndex((type) => type === query.type) === -1) {
            throw new TaskError(DBTaskError.QuerySchemaMismatch, 'Query type must be one of filter name.');
        }

        // TODO: Add regex for verifying filed name. Also nested with dot inside.
        if (typeof query.field !== 'string') {
            throw new TaskError(DBTaskError.QuerySchemaMismatch, 'Query field must be string.');
        }

        if (!isPrimitive(query.value) && !isDate(query.value)) {
            throw new TaskError(DBTaskError.QuerySchemaMismatch, 'Query value must be string, number, null, boolean or date.');
        }
    });

    return true;
}

export const verifiers = {
    areAddOptionsValid,
    areBasicValueEqual,
    isCollectionNameValid,
    isDatabaseSchemaValid,
    isDataValid,
    isPathValid,
    isQueryValid
};
