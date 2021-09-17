// License: MIT
// Author: dwf
// Project: HornbeamDB
// Version: 0.0.1
// Date of publishing: 17.09.2021

export default function hornbeamDB(fs) {

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

    let dbPath;
    let dbName;

    let database;
    let backupDb;

    // 4. Private methods

    // 4.1. File read/write methods

    async function readDbFile(path) {
        let fileStats;

        try {
            fileStats = await fs.stat(path);
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw 'FILE_NOT_FOUND';
            } else {
                throw 'FILE_SIZE_VERIFICATION_ERROR';
            }
        }

        if (fileStats.size > configuration['fileSize'] * 1024 * 1024) {
            throw 'FILE_SIZE_EXCEEDED';
        }

        try {
            const rawData = await fs.readFile(path, { encoding: 'utf-8' });
            return JSON.parse(rawData);
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw 'FILE_NOT_FOUND';
            } else {
                throw 'READ_FILE_ERROR';
            }
        }
    }

    async function writeDbFile(path, data) {
        const dataSize = Buffer.byteLength(JSON.stringify(data));

        if (dataSize > configuration['fileSizeLimitInMB'] * 1024 * 1024) {
            throw 'DATA_SIZE_EXCEEDED';
        }

        try {
            const pathArray = path.split('/');

            for (const [index, value] of pathArray.entries()) {
                if (value !== '.' && value !== '..' && !value.includes('.json')) {
                    const subPath = pathArray.slice(0, index + 1).join('/');
                    await fs.mkdir(subPath, { recursive: true });
                }
            }
        } catch (e) {
            throw 'DIRECTORY_VERIFICATION_ERROR';
        }

        try {
            await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
        } catch (e) {
            throw 'WRITE_FILE_ERROR';
        }
    }

    // 4.2. In-memory-db methods

    function createDbCopy() {
        if (!backupDb) {
            backupDb = { ...database };
        }
    }

    function createId(collection) {
        if (backupDb[collection].length === 0) {
            return 1;
        }

        let index = 1;

        for (let entry of backupDb[collection]) {
            if (entry['_id'] > index) {
                index = entry['_id'];
            }
        };

        index += 1;

        return index;
    }

    function verifyCollectionName(collectionName) {
        if (typeof collection !== 'string') {
            throw 'COLLECTION_NAME_WRONG_FORMAT';
        }

        const collectionNameRegex = /^([\w-]{configuration['collectionNameMinLength'], configuration['collectionNameMaxLength']})$/g;

        if (!collectionNameRegex.test(collectionName)) {
            throw 'COLLECTION_NAME_MISMATCH';
        }
    }

    function verifyAddedData(data) {
        if (typeof data !== 'object' || data === null) {
            throw 'ADDED_DATA_WRONG_FORMAT';
        }

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
        if (!backupDb[collection] || backupDb[collection].length === 0) {
            return;
        }

        backupDb[collection].forEach((entry) => {
            options['unique'].forEach((uniqueKey) => {
                if (entry[uniqueKey] && data[uniqueKey] === entry[uniqueKey]) {
                    throw 'DATABASE_NOT_LOADED';
                }
            });
        });

        return;
    }

    // 5. Public methods/API

    // 5.1. Database methods

    async function open(path, name) {
        if (typeof path !== 'string' || typeof name !== 'string') {
            throw 'ARGS_TYPE_ERROR';
        }

        backupDb = undefined;

        try {
            if (!database || (dbPath !== path || dbName !== name)) {
                try {
                    database = await readDbFile(`${path}/${name}.json`);
                } catch (e) {
                    if (e === 'FILE_NOT_FOUND') {
                        database = {};
                    } else {
                        throw e;
                    }
                }

                dbPath = path;
                dbName = name;
            } else {
                // TODO: Add info log only
            }
        } catch (e) {
            throw 'DATABASE_OPENING_ERROR';
        }
    }

    async function save() {
        if (!dbPath || !dbName) {
            throw 'NO_OPEN_DATABASE';
        }

        if (!backupDb) {
            throw 'NO_CHANGES_TO_SAVE';
        }

        try {
            await writeDbFile(`${dbPath}/${dbName}.json`, backupDb);
            database = { ...backupDb };
        } catch (e) {
            throw 'DATABASE_SAVING_ERROR';
        } finally {
            backupDb = undefined;
        }
    }

    function close() {
        backupDb = undefined;
        database = undefined;
    }

    // 5.2. Entries methods

    function addEntry(collection, data, options) {

        try {
            verifyDatabase();
            verifyCollectionName(collection);
            verifyAddedData(data);
            verifyAddedDataOptions(options);
            createDbCopy();

            if (!backupDb[collection]) {
                backupDb[collection] = [];
            }

            verifyValuesUniqueness(collection, data, options);

            const index = createId(collection);
            const entry = { ...data };

            entry['_id'] = index;
            entry['_createdAt'] = new Date();
            entry['_modifiedAt'] = '';


            backupDb[collection].push(entry);
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
            let data;
            
            if (backupDb) {
                data = backupDb[collection] ? [...backupDb[collection]] : [];
            } else {
                data = database[collection] ? [...database[collection]] : [];
            }

            if (data.length === 0) {
                return [];
            }

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
            createDbCopy();

            if (!backupDb[collection]) {
                throw 'No collection found.';
            }

            if (queries.length === 0) {
                throw 'No filter condition found.';
            }

            const entryIndex = backupDb[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));

            if (entryIndex > -1) {
                backupDb[collection].splice(entryIndex, 1);
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
            createDbCopy();

            if (!backupDb[collection]) {
                throw 'No collection found.';
            }

            if (queries.length === 0) {
                throw 'No filter condition found.';
            }

            const entryIndex = backupDb[collection].findIndex((entry) => queries.every((query) => filters[query.type](entry[query.field], query.value)));

            if (entryIndex > -1) {
                const storedEntry = { ...backupDb[collection][entryIndex] };
                const newEntry = { ...data };
                newEntry['_id'] = storedEntry['_id'];
                newEntry['_createdAt'] = storedEntry['_createdAt'];
                newEntry['_modifiedAt'] = new Date();

                backupDb[collection][entryIndex] = newEntry;
            } else {
                throw 'No entry for provided queries found.';
            }
        } catch (e) {
            console.error(`Error reading database`, e);
            // TODO: When error clear temp db
        }
    }

    return {
        open,
        close,
        save,
        addEntry,
        findEntries,
        removeEntry,
        replaceEntry,
    };
}