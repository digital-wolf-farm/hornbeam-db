# HornbeamDB
Simple database for storing data in JSON file.

[More info](dist/README.md)

## Goals to archieve
* No need to install additional software to store data locally on NodeJS apps.
* Light - only useful functionality, no excessive resource usage.
* Fast access to data and reduce amount of read/write operation while keeping data consistency.
* Easy to backup eg Electron app user can backup and restore own data without any specialized knowledge using external disc drive or pendrive.
* Wide range of application - allows to store users data in separate files, every module could have own file, too.
* No meaningless for user metadata added to user data.
* Stored data is easy to read and use in another app with litte migration.

## Requirements and installation
Requirements:
* `NodeJS` (checked with versions > `12.18.2`),
* uses modules: `fs/promises` and `Buffer`.

Installation:
* Install NPM package.
* Create new instance of database with optional configuration.
* Learn simple API.
* Enjoy your local database.

Example of working database - go to `Demo app` section.

## What can this library:
* Validates size of database when read and save data - doesn't allow to work above limits.
* Creates new, read existing and write on demand databases (JSON files).
* Stats database on demend.
* Checks basic schema of databases during loading database.
* Adds/removes/replaces entry.
* Finds multiple entries (with sorting and paginating options).
* Allows to prevent adding/replacing entries when given value is already added in collection (limited data types handled).
* Creating entry fields like id, date of creating and date of modification.

## What can't - requires server functionality for:
* Creating directories for database files.
* Verifying added data schemas.
* Sanitizing added data.
* Finding and merging referenced entries.
* Dropping database (removing files).

## Performance
Goal of this database library to read/store any data in less than 250ms no matter what type of disc is used (HDD or SSD). Whole server should respond on HTTP request within 300ms.  
Due to fact that reading stats of file requires approximately the same time as reading file and NodeJS do not allow to read/write file bigger than 1GB, additional step of checking file before reading was removed from initial concept.  
Idea of transactions which operated on in-memory-database with cyclic saving data in files was abandoned as there was risk of data inconsistency due to the fact that file could be changed manually between cycles.

Performance on HDD:
* Writing/reading file:
    * ~1MB - 65ms/70ms
    * ~5MB - 100ms/110ms    
    * ~10MB - 170ms/190ms
    * ~20MB - 250ms/290ms

More in `tests/performance` directory.
If you don't have such requirements apply own configuration.

## Demo app
Simple Express app using HornbeamDB. Install dependencies, run server with `npm run dev` and play with eg. Postman. Code is located in `demo` directory.

## API

Create new instance of database:
```
const db = hornbeamDB();
```

Open before any operation:
```
await db.open(path/to/file.json);
```

Basic CRUD operations:
```
db.add('collectionName', addedEntry, addOptions);
db.find('collectionName', query, findOptions);
db.replace('collectionName', query, replacingEntry, replaceOptions);
db.remove('collectionName', query);
```

After CRUD operation save changes or close without saving:
```
await db.save();
db.close();
```

To provide info to user about usage of database:
```
db.stat();
```

## Changelog

* 0.0.1 - 17.09.2021:  
    Prototyping