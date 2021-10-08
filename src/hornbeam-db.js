// License: MIT
// Author: dwf
// Project: HornbeamDB
// Version: 0.0.1
// Date of publishing: 17.09.2021

export default function hornbeamDB(fs) {

    // 1. Database data

    let database;
    let databaseFilePath;

    // 2. Configuration

    const configuration = {
        dbSizeLimitInMB: 10,
        entrySizeLimitInMB: 1,
        collectionNameMinLength: 4,
        collectionNameMaxLength: 64,
    };

    // 3. Utils

    const filters = {
        contains: (item, text) => item.toLowerCase().includes(text.toLowerCase()),
        eq: (item, value) => item === value,
        gt: (item, value) => item > value,
        gte: (item, value) => item > value,
        in: (item, arr) => arr.some((elem) => elem === item),
        lt: (item, value) => item < value,
        lte: (item, value) => item <= value,
        ne: (item, value) => item !== value,
        nin: (item, arr) => arr.every((elem) => elem !== item)
        // find by regex
        // find by defined / undefined value
        // dates comparison - check if gt, lt eq is working
        // find by geospatial data
        // find by any of this filter inside array - MongoDB - $elemMatch + array size
        // add diferent version of filters for strings (with lowercase) and for numbers, bigint and booleans or add sth like $text from MongoDB
    };

    const operationsList = Object.freeze({
        openDb: 'OPEN_DATABASE',
        saveDb: 'SAVE_DATABASE',
        addEntry: 'ADD_ENTRY',
        findEntries: 'FIND_ENTRIES',
        updateEntry: 'UPDATE_ENTRY',
        deleteEntry: 'DELETE_ENTRY'
    });

    const errorsList = Object.freeze({
        argsTypeMismatch: 'ARGS_TYPE_MISMATCH',
        arraysNotEqual: 'ARRAYS_NOT_EQUAL',
        collectionFormatMismatch: 'COLLECTION_FORMAT_MISMATCH',
        collectionNameTypeMismatch: 'COLLECTION_NAME_TYPE_MISMATCH',
        collectionNamePatternMismatch: 'COLLECTION_NAME_PATTERN_MISMATCH',
        collectionNotFound: 'COLLECTION_NOT_FOUND',
        databaseFormatMismatch: 'DATABASE_FORMAT_MISMATCH',
        databaseNotOpen: 'DATABASE_NOT_OPEN',
        dataSizeExceeded: 'DATA_SIZE_EXCEEDED',
        directoryCreateError: 'DIRECTORY_CREATE_ERROR',
        entryContainsReservedProperties: 'ENTRY_CONTAINS_RESERVED_PROPERTIES',
        entryFormatMismatch: 'ENTRY_FORMAT_MISMATCH',
        entryNotFound: 'ENTRY_NOT_FOUND',
        entryValueNotUnique: 'ENTRY_VALUE_NOT_UNIQUE',
        entrySizeExceeded: 'ENTRY_SIZE_EXCEEDED',
        fileNotFound: 'FILE_NOT_FOUND',
        fileReadError: 'FILE_READ_ERROR',
        fileWriteError: 'FILE_WRITE_ERROR',
        objectTypeMismatch: 'OBJECT_TYPE_MISMATCH',
        valueNotUnique: 'VALUE_NOT_UNIQUE'
    });

    function OperationException(operation, error, message) {
        this.operation = operation;
        this.error = error;
        this.message = message || 'No message';
    }

    function TaskException(error, message) {
        this.error = error;
        this.message = message || 'No message';
    }

    // 4. Verifiers

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
            throw new TaskException(errorsList.databaseFormatMismatch, 'Options argument must be object');
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
            throw new TaskException(errorsList.argsTypeMismatch, 'Function openDatabase() accepts only strings as arguments');
        }
    }

    function verifyCollection(collectionName) {
        if (!database[collectionName]) {
            throw new TaskException(errorsList.collectionNotFound, `Collection: ${collectionName} not found`);
        }
    }

    function verifyCollectionName(collectionName) {
        if (typeof collectionName !== 'string') {
            throw new TaskException(errorsList.collectionNameTypeMismatch, 'Collection name must be a string');
        }

        const regexString = `^([\\w-]{${configuration['collectionNameMinLength']},${configuration['collectionNameMaxLength']}})$`;
        const collectionNameRegex = new RegExp(regexString, 'g');

        if (!collectionNameRegex.test(collectionName)) {
            throw new TaskException(errorsList.collectionNamePatternMismatch, 'Collection name could contains only letters, numbers, hyphens and underscores');
        }
    }

    function verifyDatabase() {
        if (!database || !databaseFilePath) {
            throw new TaskException(errorsList.databaseNotOpen, 'Cannot find open database');
        }
    }

    function verifyDatabaseScheme() {
        try {
            verifyObject(database);
        } catch (e) {
            throw new TaskException(errorsList.databaseFormatMismatch, `Database: ${databaseFilePath} is not an object`);
        }

        for (let property in database) {
            if (database.hasOwnProperty(property)) {
                if (!Array.isArray(database[property])) {
                    throw new TaskException(errorsList.collectionFormatMismatch, `Collection ${property} is not an array`);
                }

                for (let entry of database[property]) {
                    try {
                        verifyObject(entry);
                    } catch (e) {
                        throw new TaskException(errorsList.entryFormatMismatch, `Entry: ${JSON.stringify(entry)} is not an object`);
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

        if (dataSize > configuration['dbSizeLimitInMB']) {
            throw new TaskException(errorsList.dataSizeExceeded, `Provided database file weights ${dataSize}MB (limit is ${configuration['dbSizeLimitInMB']}MB)`);
        }

        return (dataSize / configuration['dbSizeLimitInMB']).toFixed(2);
    }

    function verifyEntrySize(entry) {
        const entrySize = (Buffer.byteLength(JSON.stringify(entry)) / (1024 * 1024)).toFixed(2);

        if (entrySize > configuration['entrySizeLimitInMB']) {
            throw new TaskException(errorsList.entrySizeExceeded, `Added entry weights ${dataSize}MB (limit is ${configuration['entrySizeLimitInMB']}MB)`);
        }
    }

    function verifyFoundEntry(entryIndex) {
        if (entryIndex === -1) {
            throw new TaskException(errorsList.entryNotFound, 'Cannot find entry');
        }
    }

    function verifyObject(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            throw new TaskException(errorsList.objectTypeMismatch);
        }
    }

    function verifyEntryData(entry, newEntry) {
        try {
            verifyObject(database);
        } catch (e) {
            throw new TaskException(errorsList.entryFormatMismatch, `Added entry is not an object`);
        }

        if (newEntry) {
            if (entry['_id'] || entry['_createdAt'] || entry['_modifiedAt']) {
                throw new TaskException(errorsList.entryContainsReservedProperties, 'Added entry cannot contain any of properties: "_id", "_createdAt", "_modifiedAt"');
            }
        }
    }

    function verifyObjectNotEmpty(options) {
        if (Object.keys(options) === 0) {
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
                    throw new TaskException(errorsList.valueNotUnique, `Added entry must contain unique value for field: ${uniqueKey}`);
                }
            });
        });
    }

    // 5. Files operation functions

    async function readDbFile(path) {
        try {
            return await fs.readFile(path, { encoding: 'utf-8' });
        } catch (e) {
            throw new TaskException(e.code === 'ENOENT' ? errorsList.fileNotFound : errorsList.fileReadError, e);
        }
    }

    async function writeDbFile(path, data) {
        try {
            const pathArray = path.split('/');

            for (const [index, value] of pathArray.entries()) {
                if (value !== '.' && value !== '..' && !value.includes('.json')) {
                    const subPath = pathArray.slice(0, index + 1).join('/');
                    await fs.mkdir(subPath, { recursive: true });
                }
            }
        } catch (e) {
            throw new TaskException(errorsList.directoryCreateError, e);
        }

        try {
            await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
        } catch (e) {
            throw new TaskException(errorsList.fileWriteError, e);
        }
    }

    // 6. Other private functions

    function clearTemporaryData() {
        database = undefined;
        databaseFilePath = undefined;
    }

    function createId(collection) {
        if (database[collection].length === 0) {
            return 1;
        }

        let index = 0;

        for (let entry of database[collection]) {
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        };

        return ++index;
    }

    function findEntryIndex(collection, queries) {
        return database[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));
    }

    // 7. Database API

    async function openDatabase(path, name) {
        databaseFilePath = `${path}/${name}.json`;

        if (database) {
            database = undefined;
        }

        try {
            verifyArgumentsForOpenDb(path, name);
            const fileContent = await readDbFile(`${databaseFilePath}`);
            const databaseUsage = verifyDataSize(fileContent);
            database = JSON.parse(fileContent);
            verifyDatabaseScheme();

            return databaseUsage;
        } catch (e) {
            if (e.name === errorsList.fileNotFound) {
                database = {};

                return '0.00';
            } else {
                clearTemporaryData();

                throw new OperationException(operationsList.openDb, e.error, e.message);
            }
        }
    }

    async function saveDatabase() {
        try {
            verifyDatabase();
            const databaseUsage = verifyDataSize(database);
            verifyDatabaseScheme();
            await writeDbFile(`${databaseFilePath}`, database);

            return databaseUsage;
        } catch (e) {
            throw new OperationException(operationsList.saveDb, e.error, e.message);
        } finally {
            clearTemporaryData();
        }
    }

    function closeDatabase() {
        clearTemporaryData();
    }

    function addEntry(collection, data, options) {
        try {
            verifyAddOptions(options);
            verifyDatabase();
            verifyCollectionName(collection);
            verifyEntryData(data, true);
            verifyEntrySize(data);

            if (!database[collection]) {
                database[collection] = [];
            }

            verifyValuesUniqueness(collection, data, options); // TODO: Verify function

            const index = createId(collection);
            const entry = { ...data };

            entry['_id'] = index;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = '';

            database[collection].push(entry);

            return database[collection][length - 1];
        } catch (e) {
            clearTemporaryData();

            throw new OperationException(operationsList.addEntry, e.error, e.message);
        }
    }

    function findEntries(collection, queries, options) {
        try {
            verifyQueries(queries, false);
            verifyEditOptions(options);
            verifyDatabase();
            verifyCollectionName(collection);

            let results;

            if (!database[collection]) {
                return [];
            }

            let data = [...database[collection]];

            if (queries.length !== 0) {
                data = data.filter((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));
            }

            if (options && options.sorting && options.sorting.length >= 1) {
                // TODO: add validation of configuration, add asc/desc working, add other data types than strings
                if (options.sorting.length === 1) {
                    data.sort((a, b) => {
                        return a[options.sorting[0].field].localeCompare(b[options.sorting[0].field]);
                    });
                } else {
                    data.sort((a, b) => {
                        return a[options.sorting[0].field].localeCompare(b[options.sorting[0].field]) || a[options.sorting[1].field].localeCompare(b[options.sorting[1].field]);
                    });
                }

            }

            if (options && options.pagination) {
                const pageSize = options.pagination.pageSize || 20;
                const currentPage = options.pagination.currentPage || 1;
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / pageSize);

                results = {
                    data: data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
                    pagination: { pageSize, currentPage, totalPages, totalItems }
                };
            } else {
                results = data;
            }

            return results;
        } catch (e) {
            clearTemporaryData();

            throw new OperationException(operationsList.findEntries, e.error, e.message);
        }
    }

    function removeEntry(collection, queries) {
        try {
            verifyQueries(queries, true);
            verifyDatabase();
            verifyCollection(collection);
            verifyCollectionName(collection);

            const entryIndex = findEntryIndex(collection, queries);
            verifyFoundEntry(entryIndex);

            return database[collection].splice(entryIndex, 1);
        } catch (e) {
            clearTemporaryData();

            throw new OperationException(operationsList.deleteEntry, e.error, e.message);
        }
    }

    async function replaceEntry(collection, queries, data) {
        try {
            verifyQueries(queries, true);
            verifyDatabase();
            verifyCollection(collection);
            verifyCollectionName(collection);
            verifyEntryData(data, false);
            verifyEntrySize(data);

            const entryIndex = findEntryIndex(collection, queries);
            verifyFoundEntry(entryIndex);

            database[collection].splice(entryIndex, 1); // TODO: Verify if it is neccessary

            const storedEntry = { ...database[collection][entryIndex] };
            const newEntry = { ...data };
            newEntry['_id'] = storedEntry['_id'];
            newEntry['_createdAt'] = storedEntry['_createdAt'];
            newEntry['_modifiedAt'] = new Date();

            database[collection][entryIndex] = newEntry;

            return database[collection][entryIndex];
        } catch (e) {
            clearTemporaryData();

            throw new OperationException(operationsList.replaceEntry, e.error, e.message);
        }
    }

    return {
        openDatabase,
        closeDatabase,
        saveDatabase,
        addEntry,
        findEntries,
        removeEntry,
        replaceEntry,
    };
}
