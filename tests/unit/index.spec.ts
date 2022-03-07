import hornbeamDB from '../../src';
import { typeGuards } from '../../src/lib/type-guards';
import { validators } from '../../src/lib/validators';
import { DBAPI } from '../../src/models/interfaces';
import { DBConfig } from '../../src/utils/db-config';
import { createDB } from '../../src/lib/database';

describe.only('HornbeamDB', () => {
    // const openFn = jest.fn();

    // jest.mock('../../src/lib/database', () => ({
    //     createDB : jest.fn()
    // }));

    // (createDB as any).mockImplementation(() => ({
    //     open: openFn
    // }))

    describe('open database', () => {
        let db: DBAPI;

        beforeEach(() => {
            db = hornbeamDB();
        });

        it('should call open function, when path is valid', async () => {
            const path = 'valid/path/to/file.json';

            jest.spyOn(typeGuards, 'isString').mockReturnValueOnce(true);
            jest.spyOn(validators, 'validatePath').mockReturnValueOnce(true);
            jest.spyOn(createDB.prototype, 'open');

            try {
                await db.open(path);
            } catch (e) {
                expect(true).toBe(false);
            }

            // expect(openFn).toHaveBeenCalled();
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
