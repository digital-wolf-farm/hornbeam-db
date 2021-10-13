# HornbeamDB
Simple local database for storing data in JSON file.

## What's your story?
How store app data on local computer? - Install MongoDB.  
But that is another thing to install on user computer - Installing NodeJS/Electron and MongoDB seems to be acceptable. It only two operations.  
What about easy data backup for user? - Add import/export functionality and store backup as JSON files.  
Still it seems too heavy solution for small database. Maybe go further?  
Write own database storing data directly in JSON:
* API similar to MongoDB - allows storing documents and allow to use references between them,
* easy to backup - just copy file on backup drive to store in safe place and copy to proper directory to "import" data after fresh install,
* fast - requires performance tests and tweaking code,
* wide range of application - allows to store users data in separate files, every module could have own file, too,
* light - only useful functionality,
* as little as possible read/write file operation - speed up operations.

## Database
Something is not clear? Go to `demo` directory and check how does it work in simple Express app.  
Why database has such restrictions? Go to `tests` directory and check performance tests. Still would like to change something? Pass your own configuration.

## Requirements and installation
Requirements:
* `NodeJS` (checked with versions > `12.18.2`),
* uses modules: `fs/promises` and `Buffer`.

Installation:
* Install NPM package
* Create new instance of database with optional configuration,
* Learn simple API,
* Enjoy your local database.

## Performance
Goal of this database library to read/store any data in less than 250ms no matter what type of disc is used (HDD or SSD). Whole server should respond on HTTP request within 300ms.
Due to fact that reading stats of file requires approximately the same time as reading file and NodeJS do not allow to read/write file bigger than 1GB, additional step of checking file before reading was removed from initial concept.
Transactions which operated on in-memory-database with cyclic storing data in files was abandoned as well, as short period of access to file and lack of risk of data inconsistency as JSON files should be easily accessible for backup purposes is more beneficial.

Performance on HDD:
* Writing/reading file:
    * ~1MB - 65ms/70ms
    * ~5MB - 100ms/110ms

    
    * ~10MB - 170ms/190ms
    * ~20MB - 250ms/290ms

## Demo app
Simple Express app using HornbeamDB. Install dependencies, run server with `npm run dev` and play with eg. Postman.

## Changelog

* 0.0.1 - 17.09.2021:  
    Prototyping