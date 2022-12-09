import { openDatabase } from '.';
import * as databaseFn from './lib/database';
import { DatabaseError } from './models/enums';
import { dataValidators } from './validators/data-validators';

describe('HornbeamDB', () => {

    it('should pass', () => {
        expect(true).toBe(true);
    });
//     const exampleDatabase = { collection1: [{ _id: 1, name: 'Adam' }] };
//     // const defaultDBSize = 10;

//     // const databaseMock = {
//     //     database: jest.fn()
//     // };

//     // jest.mock('./lib/database', () => {
//     //     const database = jest.fn();

//     //     return database;
//     // });

//     describe('openDatabase', () => {
//         it('opens database with default size limit when valid and no additional argument passed', async () => {

//             jest.spyOn(databaseValidators, 'isDatabaseSizeNotExceeded').mockReturnValueOnce();
//             jest.spyOn(databaseValidators, 'isDatabaseSchemaValid').mockReturnValueOnce();
//             jest.spyOn(databaseFn, 'database');

//             try {
//                 await openDatabase(path);
//             } catch (e) {
//                 expect(true).toBe(false);
//             }

//             expect(databaseFn.database).toHaveBeenCalledWith(exampleDatabase, expectedOptionsObject);
//         });

//         it('throw error when opening database with invalid path', async () => {
//             const path = 'invalid/path/to/file.json';

//             // jest.spyOn(databaseValidators, 'isFilePathValid').mockImplementation(() => {
//             //     throw new InternalError(DatabaseError.FilePathError, 'Invalid path');
//             // });

//             try {
//                 await openDatabase(path);
//             } catch (e) {
//                 expect(e.name).toBe(DatabaseError.FilePathError);
//                 expect(e.message).toContain('Invalid path');
//             }

//             expect(databaseFn.database).toThrow();
//         });
//     });
});