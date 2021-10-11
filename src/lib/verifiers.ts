import { BDTaskError } from '../enums/db-task-error';
import { TaskError } from '../utils/errors';

function verifyAddOptions(options) {
    // {
    //     unique: ['property1', 'property2']
    // }

    if (options === undefined) {
        return;
    }

    const allowedProperties = ['unique'];

    try {
        verifyObject(options);
        verifyObjectNotEmpty(options);
        verifyArrayEquality(allowedProperties, Object.keys(options)); // TODO: every property is optional
        verifyArray(options['unique']);
        verifyArrayElementsType(options['unique'], 'string', 1);
    } catch (e) {
        throw new TaskError(BDTaskError.databaseFormatMismatch, 'Options argument must be object');
    }
}

function verifyArray(array) {
    if (!Array.isArray(array)) {
        throw 'Provided value is not array';
    }
}

function verifyArrayElementsType(array, elemsType, minLength) {
    if (array.length < minLength) {
        throw 'Array length is shorter than minimum';
    }

    for (let elem of array) {
        if (typeof elem !== elemsType) {
            throw 'Array elements type mismatch';
        }
    }
}

function verifyArrayEquality(referenceArray, verifiedArray) {
    const isEqual = (referenceArray.length === verifiedArray.length) && verifiedArray.every((element, index) => {
        return element === referenceArray[index]; 
    });

    if (!isEqual) {
        throw 'Provided arrays are not equal';
    }
}

function verifyEditOptions(options) {
    // TODO: Add logic
}

function verifyArgumentsForOpenDb(path, name) {
    if (typeof path !== 'string' || typeof name !== 'string') {
        throw new TaskError(BDTaskError.argsTypeMismatch, 'Function openDatabase() accepts only strings as arguments');
    }
}

function verifyCollection(collectionName) {
    if (!database[collectionName]) {
        throw new TaskError(BDTaskError.collectionNotFound, `Collection: ${collectionName} not found`);
    }
}

function verifyCollectionName(collectionName) {
    if (typeof collectionName !== 'string') {
        throw new TaskError(BDTaskError.collectionNameTypeMismatch, 'Collection name must be a string');
    }

    const regexString = `^([\\w-]{${configuration['collectionNameMinLength']},${configuration['collectionNameMaxLength']}})$`;
    const collectionNameRegex = new RegExp(regexString, 'g');

    if (!collectionNameRegex.test(collectionName)) {
        throw new TaskError(BDTaskError.collectionNamePatternMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores');
    }
}

function verifyDatabase() {
    if (!database || !databaseFilePath) {
        throw new TaskError(BDTaskError.databaseNotOpen, 'Cannot find open database');
    }
}

function verifyDatabaseScheme() {
    try {
        verifyObject(database);
    } catch (e) {
        throw new TaskError(BDTaskError.databaseFormatMismatch, `Database: ${databaseFilePath} is not an object`);
    }

    for (let property in database) {
        if (database.hasOwnProperty(property)) {
            if (!Array.isArray(database[property])) {
                throw new TaskError(BDTaskError.collectionFormatMismatch, `Collection ${property} is not an array`);
            }

            for (let entry of database[property]) {
                try {
                    verifyObject(entry);
                } catch (e) {
                    throw new TaskError(BDTaskError.entryFormatMismatch, `Entry: ${JSON.stringify(entry)} is not an object`);
                }
            }
        }
    }
}

function verifyDataSize(data) {
    let dataSize;

    if (typeof data !== 'string') {
        dataSize = (Buffer.byteLength(JSON.stringify(data)) / (1024 * 1024)).toFixed(2);
    } else {
        dataSize = (Buffer.byteLength(data) / (1024 * 1024)).toFixed(2);
    }

    if (dataSize > configuration['dbSize']) {
        throw new TaskError(BDTaskError.dataSizeExceeded, `Provided database file weights ${dataSize}MB (limit is ${configuration['dbSize']}MB)`);
    }

    return (dataSize / configuration['dbSize']).toFixed(2);
}

function verifyEntrySize(entry) {
    const entrySize = (Buffer.byteLength(JSON.stringify(entry)) / (1024 * 1024));

    if (entrySize > configuration['entrySize']) {
        throw new TaskError(BDTaskError.entrySizeExceeded, `Added entry weights ${entrySize.toFixed(2)}MB (limit is ${configuration['entrySize']}MB)`);
    }
}

function verifyFoundEntry(entryIndex) {
    if (entryIndex === -1) {
        throw new TaskError(BDTaskError.entryNotFound, 'Cannot find entry');
    }
}

function verifyObject(data) {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new TaskError(BDTaskError.objectTypeMismatch, '');
    }
}

function verifyEntryData(entry, newEntry) {
    try {
        verifyObject(database);
    } catch (e) {
        throw new TaskError(BDTaskError.entryFormatMismatch, `Added entry is not an object`);
    }

    if (newEntry) {
        if (entry['_id'] || entry['_createdAt'] || entry['_modifiedAt']) {
            throw new TaskError(BDTaskError.entryContainsReservedProperties, 'Added entry cannot contain any of properties: "_id", "_createdAt", "_modifiedAt"');
        }
    }
}

function verifyObjectNotEmpty(options) {
    if (Object.keys(options).length === 0) {
        throw 'Object cannot be empty';
    }
}

function verifyQueries(queries, isQueryRequired) {
    // TODO: Add logic
}

function verifyValuesUniqueness(collection, data, options) {
    // TODO: Add case insensivity for strings
    // TODO: Limit unique values to strings, numbers, bigints and dates

    if (options === undefined || !options['unique']) {
        return;
    }

    if (!database[collection] || database[collection].length === 0) {
        return;
    }

    database[collection].forEach((entry) => {
        options['unique'].forEach((uniqueKey) => {
            if (entry[uniqueKey] && data[uniqueKey] === entry[uniqueKey]) {
                throw new TaskError(BDTaskError.valueNotUnique, `Added entry must contain unique value for field: ${uniqueKey}`);
            }
        });
    });
}

export const verifiers = {
    verifyAddOptions,
    verifyArgumentsForOpenDb,
    verifyArray,
    verifyArrayElementsType,
    verifyArrayEquality,
    verifyCollection,
    verifyCollectionName,
    verifyDatabase,
    verifyDatabaseScheme,
    verifyDataSize,
    verifyEditOptions,
    verifyEntryData,
    verifyEntrySize,
    verifyFoundEntry,
    verifyObject,
    verifyObjectNotEmpty,
    verifyQueries,
    verifyValuesUniqueness
}