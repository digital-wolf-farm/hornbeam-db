import { hornbeamDB } from '../../src';
import { typeGuards } from '../../src/lib/type-guards';
import { validators } from '../../src/lib/validators';
import { DBAPI } from '../../src/models/interfaces';
import { DBConfig } from '../../src/utils/db-config';
import createDB from '../../src/lib/database';

const databaseMock = {
    open: jest.fn()
};

jest.mock('../../src/lib/database', () => {
    const createDB = jest.fn(() => databaseMock);

    return {
        default: createDB
    };
});

describe.skip('HornbeamDB', () => {

    describe('Open database', () => {
        let db: DBAPI;

        beforeEach(() => {
            db = hornbeamDB();
        });

        it('should call open function when path is valid', async () => {
            const path = 'valid/path/to/file.json';

            jest.spyOn(typeGuards, 'isString').mockReturnValueOnce(true);
            jest.spyOn(validators, 'validatePath').mockReturnValueOnce(true);

            try {
                await db.open(path);
            } catch (e) {
                expect(true).toBe(false);
            }

            expect(createDB).toHaveBeenCalled();
            expect(databaseMock.open).toHaveBeenCalled();
        });
    });

    // describe('should close database', () => {

    // });

    // describe('should save database', () => {

    // });

    // describe('should stat database', () => {

    // });

    // describe('should add entry', () => {

    // });

    // describe('should find entries', () => {

    // });

    // describe('should replace entry', () => {

    // });

    // describe('should remove entry', () => {

    // });
});
