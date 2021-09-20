// License: MIT
// Author: dwf
// Project: HornbeamDB
// Version: 0.0.1
// Date of publishing: 17.09.2021

export default function hornbeamDB(fs, logger) {

    logger.info('Initialized');

    // 1. Configuration of database

    const configuration = {
        fileSizeLimitInMB: 10,
        collectionsNumberLimit: 20,
        collectionNameMinLength: 4,
        collectionNameMaxLength: 64,
        entriesNumberLimit: 10000,
        entrySizeLimitInKB: 100
    };

    // 2. Utils

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

    // 3. Variables

    let database;
    let databaseFilePath;
    let databaseUsage;

    // 4. Helper functions

    function clearTemporaryData() {
        database = undefined;
        databaseFilePath = undefined;
        databaseUsage = undefined;
    }

    function isDataObject(data) {
        if (typeof data !== 'object' || data === null) {
            logger.error(`Provided data is not an object`);
            throw 'DATA_WRONG_FORMAT';
        }
    }

    // 5. Private methods

    // 5.1. File read/write methods

    function verifyDataFormat(data) {
        isDataObject(data);

        for (let property in data) {
            if (data.hasOwnProperty(property)) {
                if (!Array.isArray(data[property])) {
                    logger.error(`Provided object property ${property} is not an array`);
                    throw 'DATA_WRONG_FORMAT';
                }

                for (let entry of data[property]) {
                    isDataObject(entry);
                }
            }
        }
    }

    function verifyDataSize(data) {
        const dataSize = (Buffer.byteLength(data) / (1024 * 1024)).toFixed(2);

        if (dataSize > configuration['fileSizeLimitInMB']) {
            logger.error(`Data size verification error - ${dataSize}MB greater than limit`);
            throw 'DATA_SIZE_EXCEEDED';
        }

        return (dataSize / configuration['fileSizeLimitInMB']).toFixed(2);
    }

    async function readDbFile(path) {
        try {
            return fs.readFile(path, { encoding: 'utf-8' });
        } catch (e) {
            logger.error(`Error while reading file ${path}`, e);
            throw e.code === 'ENOENT' ? 'FILE_NOT_FOUND' : 'READ_FILE_ERROR';
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
            logger.error(`Error while creating directories for file ${path}`, e);
            throw 'DIRECTORY_VERIFICATION_ERROR';
        }

        try {
            await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
        } catch (e) {
            logger.error(`Error while writing file ${path}`, e);
            throw 'WRITE_FILE_ERROR';
        }
    }

    // 5.2. In-memory-db methods

    function createId(collection) {
        if (backupDb[collection].length === 0) { // No backupDB
            return 1;
        }

        let index = 1;

        for (let entry of backupDb[collection]) { // No backupDB
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        };

        index += 1;

        return index;
    }

    function verifyCollectionName(collectionName) {
        if (typeof collectionName !== 'string') {
            throw 'COLLECTION_NAME_WRONG_FORMAT';
        }

        const collectionNameRegex = new RegExp(`^([\w-]{${configuration['collectionNameMinLength']},${configuration['collectionNameMaxLength']}})$`, 'g');

        if (!collectionNameRegex.test(collectionName)) {
            throw 'COLLECTION_NAME_MISMATCH';
        }
    }

    function verifyAddedData(data) {
        isDataObject(data);

        const dataSize = Buffer.byteLength(JSON.stringify(data));

        if (dataSize > configuration['entrySizeLimitInKB'] * 1024) {
            throw 'ADDED_DATA_SIZE_EXCEEDED';
        }

        if (data['_id'] || data['_createdAt'] || data['_modifiedAt']) {
            throw 'ADDED_DATA_CONTAINS_RESERVED_FIELD(S)';
        }

        return;
    }

    function verifyAddedDataOptions(options) {
        if (typeof options !== 'object' || options === null) {
            throw 'ADDED_DATA_OPTIONS_WRONG_FORMAT';
        }

        // TODO: Add verification that object contains only keys listed in array
        // TODO: Add verification that all values are valid
        // TODO: For unique values verify, that added data contains all keys from unique values array
    }

    function verifyDatabase() {
        if (!database) {
            throw 'DATABASE_NOT_LOADED';
        }

        return;
    }

    function verifyValuesUniqueness(collection, data, options) {
        if (!backupDb[collection] || backupDb[collection].length === 0) { // No backupDB
            return;
        }

        backupDb[collection].forEach((entry) => { // No backupDB
            options['unique'].forEach((uniqueKey) => {
                if (entry[uniqueKey] && data[uniqueKey] === entry[uniqueKey]) {
                    throw 'DATABASE_NOT_LOADED';
                }
            });
        });

        return;
    }

    // 6. Public methods/API

    // 6.1. Database methods

    async function openDatabase(path, name) {
        logger.info(`Opening database - ${name}`);

        if (typeof path !== 'string' || typeof name !== 'string') {
            logger.error('openDatabase() argument(s) type error');
            throw 'ARGS_TYPE_ERROR';
        }

        databaseFilePath = `${path}/${name}.json`;

        let rawData;

        try {
            logger.info(`Reading database file - ${databaseFilePath}`);
            rawData = await readDbFile(`${databaseFilePath}`);

            logger.info(`File read successfully. Verifing data.`);
            databaseUsage = verifyDataSize(rawData);
            database = JSON.parse(rawData);
            rawData = undefined;
            verifyDataFormat(database);
            
            logger.info(`Database opened successfully. Current usage - ${databaseUsage}%`);
        } catch (e) {
            if (e === 'FILE_NOT_FOUND') {
                logger.warn(`Could not find database file. Creating new database.`);
                database = {};
                databaseUsage = 0;
            } else {
                logger.error('Opening database error.');
                clearTemporaryData();
            }

            throw 'DATABASE_OPENING_ERROR';
        }
    }

    async function saveDatabase() {
        logger.info(`Saving database file - ${databaseFilePath}`);

        if (!database || !databaseFilePath) {
            logger.error('No temporary data to save database file.');
            throw 'NO_OPEN_DATABASE';
        }

        try {
            logger.info(`Verifing data before saving database file.`);
            databaseUsage = verifyDataSize(database);
            verifyDataFormat(database);

            logger.info(`Data verified successfully. Saving file.`);
            await writeDbFile(`${databaseFilePath}`, database);

            logger.info(`Database file saved successfully. Clearing temporary data.`);
            clearTemporaryData();
        } catch (e) {
            logger.error('Saving database error.');
            throw 'DATABASE_SAVING_ERROR';
        }
    }

    function closeDatabase() {
        logger.info(`Clearing database temporary data.`);
        clearTemporaryData();
    }

    // 6.2. Entries methods

    function addEntry(collection, data, options) {
        try {
            verifyDatabase();
            verifyCollectionName(collection);
            verifyAddedData(data);
            verifyAddedDataOptions(options);

            if (!backupDb[collection]) { // No backupDB
                backupDb[collection] = []; // No backupDB
            }

            verifyValuesUniqueness(collection, data, options);

            const index = createId(collection);
            const entry = { ...data };

            entry['_id'] = index;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = '';


            backupDb[collection].push(entry); // No backupDB
        } catch (e) {
            // TODO: When error clear temp db
            throw e;
        }
    }

    function findEntries(collection, queries, options) {
        // TODO: Add queries and options validation

        try {
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
                // add validation of configuration, add asc/desc working, add other data types than strings
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
            console.error(`Error reading database`, e);
            throw e;
            // TODO: When error clear temp db
        }
    }

    function removeEntry(collection, queries) {
        // TODO: Add queries validation

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
                backupDb[collection].splice(entryIndex, 1); // No backupDB
            } else {
                throw 'No entry for provided queries found.';
            }
        } catch (e) {
            console.error(`Error reading database`, e);
            throw e;
            // TODO: When error clear temp db
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
            console.error(`Error reading database`, e);
            // TODO: When error clear temp db
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