import { DBTaskError } from '../enums/db-task-error';
import { DB } from '../models/db';
import { Entry } from '../models/entry';
import { TaskError } from '../utils/errors';

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

    if(options['unique'] && Array.isArray(options['unique']) && !areArrayElementsProperType(options['unique'], 'string')) {
        throw new TaskError(DBTaskError.OptionsSchemaMismatch, '"Unique" property of options object must be an array with strings.');
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

function isCollectionNameValid(name: string, config: any): void {
    if (typeof name !== 'string') {
        throw new TaskError(DBTaskError.CollectionNameMismatch, 'Collection name must be a string.');
    }

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

export const verifiers = {
    areAddOptionsValid,
    isCollectionNameValid,
    isDatabaseSchemaValid,
    isDataValid,
    isPathValid
};
