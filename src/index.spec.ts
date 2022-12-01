import { openDB } from '.';
import * as databaseFn from './lib/database';
import { fileSystem } from './lib/file-system';
import { DatabaseError } from './models/enums';
import { InternalError } from './utils/errors';
import { databaseValidators } from './validators/database-validators';

describe('HornbeamDB', () => {
    const exampleDatabase = { collection1: [{ _id: 1, name: 'Adam' }] };
    const defaultDBSize = 10;

    // const databaseMock = {
    //     database: jest.fn()
    // };

    // jest.mock('./lib/database', () => {
    //     const database = jest.fn();

    //     return database;
    // });

    describe('OpenDB', () => {
        it('opens database with default size limit when valid and no additional argument passed', async () => {
            const path = 'valid/path/to/file.json';
            const expectedOptionsObject = {
                dbSizeLimit: defaultDBSize,
                path
            };

            jest.spyOn(databaseValidators, 'isFilePathValid').mockReturnValueOnce();
            jest.spyOn(databaseValidators, 'isDatabaseSizeNotExceeded').mockReturnValueOnce();
            jest.spyOn(databaseValidators, 'isDatabaseSchemaValid').mockReturnValueOnce();
            jest.spyOn(fileSystem, 'read').mockResolvedValueOnce(exampleDatabase);
            jest.spyOn(databaseFn, 'database');

            try {
                await openDB(path);
            } catch (e) {
                expect(true).toBe(false);
            }

            expect(databaseFn.database).toHaveBeenCalledWith(exampleDatabase, expectedOptionsObject);
        });

        it('throw error when opening database with invalid path', async () => {
            const path = 'invalid/path/to/file.json';

            jest.spyOn(databaseValidators, 'isFilePathValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.FilePathError, 'Invalid path');
            });

            try {
                await openDB(path);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FilePathError);
                expect(e.message).toContain('Invalid path');
            }

            expect(databaseFn.database).toThrow();
        });
    });
});