// License: MIT
// Author: dwf
// Project: HornbeamDB
// Version: 0.0.1
// Date of publishing: 17.09.2021

export default function hornbeamDB(fs, logger, moduleName) {

    logger.debug(moduleName ? `Initialized for module - ${moduleName}` : 'Initialized');

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
        collectionFormatMismatch: 'COLLECTION_FORMAT_MISMATCH',
        collectionNameTypeMismatch: 'COLLECTION_NAME_TYPE_MISMATCH',
        collectionNamePatternMismatch: 'COLLECTION_NAME_PATTERN_MISMATCH',
        databaseFormatMismatch: 'DATABASE_FORMAT_MISMATCH',
        databaseNotOpen: 'DATABASE_NOT_OPEN',
        dataSizeExceeded: 'DATA_SIZE_EXCEEDED',
        directoryCreateError: 'DIRECTORY_CREATE_ERROR',
        entryContainsReservedProperties: 'ENTRY_CONTAINS_RESERVED_PROPERTIES',
        entryFormatMismatch: 'ENTRY_FORMAT_MISMATCH',
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

    function verifyArgumentsForOpenDb(path, name) {
        if (typeof path !== 'string' || typeof name !== 'string') {
            const msg = 'Function openDatabase() accepts only strings as arguments';
            logger.debug(msg);

            throw new TaskException(errorsList.argsTypeMismatch, msg);
        }
    }

    function verifyCollectionName(collectionName) {
        if (typeof collectionName !== 'string') {
            const msg = 'Collection name validation error - name must be a string';
            logger.debug(msg);

            throw new TaskException(errorsList.collectionNameTypeMismatch, msg);
        }

        const regexString = `^([\\w-]{${configuration['collectionNameMinLength']},${configuration['collectionNameMaxLength']}})$`;
        const collectionNameRegex = new RegExp(regexString, 'g');

        if (!collectionNameRegex.test(collectionName)) {
            const msg = 'Collection name validation error - name could contain only letters, numbers, hyphens and underscores';
            logger.debug(msg);

            throw new TaskException(errorsList.collectionNamePatternMismatch, msg);
        }
    }

    function verifyDatabase() {
        if (!database || !databaseFilePath) {
            const msg = 'Cannot find open database';
            logger.debug(msg);
            
            throw new TaskException(errorsList.databaseNotOpen, msg);
        }
    }

    function verifyDatabaseScheme() {
        try {
            verifyIfObject(database);
        } catch (e) {
            const msg = `Database: ${databaseFilePath} is not an object`;
            logger.debug(msg);
            
            throw new TaskException(errorsList.databaseFormatMismatch, msg);
        }

        for (let property in database) {
            if (database.hasOwnProperty(property)) {
                if (!Array.isArray(database[property])) {
                    const msg = `Collection ${property} is not an array`;
                    logger.debug(msg);
                    throw new TaskException(errorsList.collectionFormatMismatch, msg);
                }

                for (let entry of database[property]) {
                    try {
                        verifyIfObject(entry);
                    } catch (e) {
                        const msg = `Entry: ${JSON.stringify(entry)} is not an object`;
                        logger.debug(msg);
                        
                        throw new TaskException(errorsList.entryFormatMismatch, msg);
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
            const msg = `Provided database file weights ${dataSize}MB (limit is ${configuration['dbSizeLimitInMB']}MB)`;
            logger.debug(`Data size verification for file: ${databaseFilePath} failed - file weights: ${dataSize}MB`);

            throw new TaskException(errorsList.dataSizeExceeded, msg);
        }

        return (dataSize / configuration['dbSizeLimitInMB']).toFixed(2);
    }

    function verifyEntrySize(entry) {
        const entrySize = (Buffer.byteLength(JSON.stringify(entry)) / (1024 * 1024)).toFixed(2);

        if (entrySize > configuration['entrySizeLimitInMB']) {
            const msg = `Added entry weights ${dataSize}MB (limit is ${configuration['entrySizeLimitInMB']}MB)`;
            logger.debug(`Data size verification failed - entry weights: ${dataSize}MB`);

            throw new TaskException(errorsList.entrySizeExceeded, msg);
        }
    }

    function verifyIfObject(data) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {

            throw new TaskException(errorsList.objectTypeMismatch);
        }
    }

    function verifyNewEntry(entry) {
        try {
            verifyIfObject(database);
        } catch (e) {
            const msg = `Added entry is not an object`;
            logger.debug(msg);
            
            throw new TaskException(errorsList.entryFormatMismatch, msg);
        }

        if (entry['_id'] || entry['_createdAt'] || entry['_modifiedAt']) {
            const msg = 'Added entry cannot contain any of properties: "_id", "_createdAt", "_modifiedAt"';
            logger.debug(msg);
            
            throw new TaskException(errorsList.entryContainsReservedProperties, msg);
        }
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
                    const msg = `Added entry must contain unique value for field: ${uniqueKey}`;
                    logger.debug(msg);

                    throw new TaskException(errorsList.valueNotUnique, msg);
                }
            });
        });
    }

    // 5. Files operation functions

    async function readDbFile(path) {
        try {
            return await fs.readFile(path, { encoding: 'utf-8' });
        } catch (e) {
            logger.debug(`Error while reading file: ${path}`, e);

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
            logger.debug(`Error while creating directories for file: ${path}`, e);
            throw new TaskException(errorsList.directoryCreateError, e);
        }

        try {
            await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
        } catch (e) {
            logger.debug(`Error while writing file: ${path}`, e);
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

    // 7. Database API

    async function openDatabase(path, name) {
        databaseFilePath = `${path}/${name}.json`;

        logger.debug(`Opening database from path - ${databaseFilePath}`);

        if (database) {
            logger.debug('Clearing previous database');
            database = undefined;
        }

        try {
            verifyArgumentsForOpenDb(path, name);
            const fileContent = await readDbFile(`${databaseFilePath}`);
            const databaseUsage = verifyDataSize(fileContent);
            database = JSON.parse(fileContent);
            verifyDatabaseScheme();

            logger.debug(`Database opened successfully. Current usage - ${databaseUsage}%`);

            return databaseUsage;
        } catch (e) {
            if (e.name === errorsList.fileNotFound) {
                logger.debug(`Could not find database file. Creating new database`);
                database = {};

                return '0.00';
            } else {
                logger.debug('Opening database error', e.message);
                clearTemporaryData();

                throw new OperationException(operationsList.openDb, e.error, e.message);
            }
        }
    }

    async function saveDatabase() {
        logger.debug(`Saving database file - ${databaseFilePath}`);

        try {
            verifyDatabase();
            const databaseUsage = verifyDataSize(database);
            verifyDatabaseScheme();
            await writeDbFile(`${databaseFilePath}`, database);

            logger.debug(`Database file saved successfully. Clearing temporary data.`);

            return databaseUsage;
        } catch (e) {
            logger.debug('Saving database error', e.message);
            
            throw new OperationException(operationsList.saveDb, e.error, e.message);
        } finally {
            clearTemporaryData();
        }
    }

    function closeDatabase() {
        logger.debug(`Closing database without saving changes.`);
        clearTemporaryData();
    }

    function addEntry(collection, data, options) {
        try {
            verifyDatabase();
            verifyCollectionName(collection);
            verifyNewEntry(data);
            verifyEntrySize(data);

            // TODO: Add verifier for options object

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

            return entry;
        } catch (e) {
            clearTemporaryData();

            throw new OperationException(operationsList.addEntry, e.error, e.message);
        }
    }

    function findEntries(collection, queries, options) {
        try {
            verifyDatabase();
            verifyCollectionName(collection);
            // TODO: add queries validation
            // TODO: add options validation

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
            verifyDatabase();
            verifyCollectionName(collection);
            // TODO: Add queries validation

            if (!database[collection]) {
                throw 'No collection found.';
            }

            if (queries.length === 0) {
                throw 'No filter condition found.';
            }

            const entryIndex = database[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));

            if (entryIndex > -1) {
                database[collection].splice(entryIndex, 1);
            } else {
                throw 'No entry for provided queries found.';
            }
        } catch (e) {
            clearTemporaryData();
            
            throw new OperationException(operationsList.deleteEntry, e.error, e.message);
        }
    }

    async function replaceEntry(collection, queries, data) {
        // TODO: Add queries and data validation

        try {
            verifyDatabase();
            verifyCollectionName(collection);

            if (!backupDb[collection]) { // No backupDB
                throw 'No collection found.';
            }

            if (queries.length === 0) {
                throw 'No filter condition found.';
            }

            const entryIndex = backupDb[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value))); // No backupDB

            if (entryIndex > -1) {
                const storedEntry = { ...backupDb[collection][entryIndex] }; // No backupDB
                const newEntry = { ...data };
                newEntry['_id'] = storedEntry['_id'];
                newEntry['_createdAt'] = storedEntry['_createdAt'];
                newEntry['_modifiedAt'] = new Date();

                backupDb[collection][entryIndex] = newEntry; // No backupDB
            } else {
                throw 'No entry for provided queries found.';
            }
        } catch (e) {
            clearTemporaryData();
            throw e;
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