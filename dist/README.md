# HornbeamDB

## Concept

Lightweight alternative to NoSQL databases. Initially developed as persistent data storage in Electron app. Evolved to library handling data stored in format compatible with JSON, working in all environments (browser, server, desktop).

Database in library is a set of collections. Collection is a list of entries. Every entry contains fields with their values.

## First steps

1. Install library

```js
    npm install @dwf/hornbeam-db
```

2. Import entry file

```js
    import { hornbeamDb } from '@dwf/hornbeam-db';
```

3. Load database

```js
    const db = hornbeamDb.loadData(myData);
```

4. Get collection

```js
    const collection = db.getCollection('name', 'optionalUniqueField');
```

5. Basic CRUD operation on data

```js
    const insertedEntryId = collection.insert(newEntry);
    const wholeCollection = collection.find().results();
    const foundCollectionSubset = collection.find(query).sort('sortParams', 'optionalLang').limit(25, 50).results();
```

6. Finally, export modified database

```js
    const dataToSave = db.exportData();
```

## What library do (features)

- Validation schema of imported/exported databases.
- Cleaning up (removing empty collections) databases before export.
- Basic validation of inputs (read more: 'What library cannot do').
- Setting unique field (index) on collections.
- Basic CRUD operation on data.
- Sorting and/or paginating found lists of entries.

## What library cannot do (your app responsibilities)

- Reading/writing files with data.
- Security stuff (eg. sanitization of inputs).
- Check size of databases, collections, entries to keep proper performance.
- Backup data.
- Drop database.

## Errors

### Error format

```
{
    method: string
    error: string
    message: string
}

```
Field `method` describes library API method which throws error. Field `error` indicates what type of error occured. `message` pass details about error.

### List of errors

* `COLLECTION_NAME_MISMATCH` - wrong name of collection
* `COLLECTION_NOT_EXISTS` - attempt to read data from not existing collection
* `DATABASE_NOT_OPEN` - attempt to access data before loading database
* `DATABASE_SCHEMA_MISMATCH` - database data format is wrong
* `DATABASE_SIZE_EXCEEDED` - database size exceeded configured limit
* `FIELD_NOT_FOUND` - attempt to operate on not existing field
* `FIELD_VALUE_NOT_UNIQUE` - attempt to add entry with duplicated value for field marked as containing only unique values
* `FILE_NOT_FOUND` - cannot find file with database (error is not emitted as no file means that it's first run of database and creates empty database)
* `FILE_READ_ERROR` - cannot read file (due to other reason than not found)
* `FILE_WRITE_ERROR` - cannot write file
* `FUNCTION_ARGUMENT_MISMATCH` - wrong type and/or content of passed argument
* `SORT_DATA_TYPE_ERROR` - ?

## Performance

## API

### Interfaces

```js
interface HornbeamAPI {
    getCollection(name: string, uniqueField?: string): Collection;
    exportData(): HornbeamData;
}
```

```js
interface HornbeamData {
    [collectionName: string]: Entry[];
}
```

```js
interface InsertedEntry {
    _id?: never;
    [field: string]: unknown;
}

interface Entry {
    _id: number;
    [field: string]: unknown;
}
```

```js
interface Collection {
    insert(entry: InsertedEntry): number;
    get(id: number): Entry | undefined;
    find(query?: Query): FindMethods;
    replace(entry: Entry): number | undefined;
    remove(id: number): number | undefined;
}
```

### Initializing database

1. Loading database

    Starting point of library. Requires data wrapped into object, where keys are collections names. Each collection is a list of entries. Return database API.

    ```js
    loadData(data: HornbeamData): HornbeamAPI
    ```
    
    Possible errors:
    * `DATABASE_SCHEMA_MISMATCH` - loaded database schema is not valid

### Database operation methods

1. Getting collection

    When database is loaded, it is required to operate on selected collection. If there is no stored collection with given name, new empty is created.

    ```js
    getCollection(name: string, uniqueField?: string): Collection
    ```
    Possible errors:  
    * `COLLECTION_NAME_ERROR` - provided collection name is not a string
    * `COLLECTION_OPTIONS_ERROR` - provided unique field name is not a string


2. Exporting data

    After finishing modifying data, this methods allows to get updated date to store in in file system. Before returning all empty collections are removed and schema is validated.

    ```js
    exportData(): HornbeamData
    ```
    Possible errors:
    * `DATABASE_SCHEMA_MISMATCH` - modified database schema is not valid

### Collection methods

1. Insert new entry

    ```js
    insert(collectionName: string, data: NewEntry, uniqueFields?: string[]): number
    ```
    Possible errors:
    * `FUNCTION_ARGUMENT_MISMATCH`
    * `DATABASE_NOT_OPEN`
    * `FIELD_VALUE_NOT_UNIQUE`
    * `DATABASE_SIZE_EXCEEDED`

2. Find entries

    ```js
    find(collectionName: string, query: Query[], options?: FindOptions): FindResults
    ```
    Possible errors:
    * `FUNCTION_ARGUMENT_MISMATCH`
    * `DATABASE_NOT_OPEN`
    * `COLLECTION_NOT_EXISTS`

3. Find entry by id

    ```js
    findById(collectionName: string, id: number): Entry
    ```
    Possible errors:
    * `FUNCTION_ARGUMENT_MISMATCH`
    * `DATABASE_NOT_OPEN`
    * `COLLECTION_NOT_EXISTS`

