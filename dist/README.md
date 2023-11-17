# HornbeamDB

## Concept

## Definitions

## First steps

## Features

## What library cannot do (your app responsibilities)

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

### Database operation methods

1. Open (load from file) database

    ```js
    async open(path: string): Promise<void>
    ```
    Possible errors:
    * `FUNCTION_ARGUMENT_MISMATCH`
    * `FILE_READ_ERROR`
    * `DATABASE_SCHEMA_MISMATCH`
    * `DATABASE_SIZE_EXCEEDED`


2. Close database (clear in-memory-database without updating file)

    ```js
    close(): <void>
    ```
    Possible errors:  
        *no errors*


3. Save database (update database file without clearing in-memory-database)

    ```js
    async save(): Promise<void>
    ```
    Possible errors:
    * `DATABASE_NOT_OPEN`
    * `DATABASE_SCHEMA_MISMATCH`
    * `DATABASE_SIZE_EXCEEDED`
    * `FILE_WRITE_ERROR`


3. Get stats of database (return usage of available space for data)

    ```js
    stats(): string
    ```
    Possible errors:
    * `DATABASE_NOT_OPEN`

### Data manipulation methods

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

