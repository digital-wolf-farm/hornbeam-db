# HornbeamDB
Simple local database for storing data in JSON file.

## Database
No NPM required to have database in your code. Go to `src` directory, copy content of the only on file into your project and enjoy it.  
Something is not clear? Go to `demo` directory and check how does it work in simple Express app.  
Why database has such restrictions? Go to `tests` directory and check performance tests. Still would like to change something? Clone repo, perform tests with your config and apply new settings to your instance of database.

## Requirements
Database checked with:
* `NodeJS > v12.18.2`,
* uses module `fs/promises` which have to be injected.

## Demo app
Simple Express app using HornbeamDB. Install dependencies, run server with `npm run dev` and play with eg. Postman.

## Tests
Performance tests to check if code is efficient. Unit tests to check if code trustworthy.

Performance with default values:
* Writing/reading file:
    * ~1MB - 65ms/70ms
    * ~5MB - 100ms/110ms
    * ~10MB - 170ms/190ms
    * ~20MB - 250ms/290ms
 
## Current version
Current version is always on `main` branch. Official versions (patches versions are skipped) are stored on their branches. When you see newer version check changelog and copy newer version.

## Changelog

* 0.0.1 - 17.09.2021:  
    Prototyping