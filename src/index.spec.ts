import { DatabaseData, openDatabase } from '.';
import * as databaseFn from './lib/database';
import { DatabaseError } from './models/enums';
import { InternalError } from './utils/errors';
import { dataValidators } from './validators/data-validators';

describe('HornbeamDB', () => {

    const validDatabase = { collection1: [{ _id: 1, name: 'Adam' }] };
    const invalidDatabase = { collection1: { _id: 1, name: 'Adam' } };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('opens database when valid data passed and no size limit set', async () => {
        jest.spyOn(dataValidators, 'isDataSchemaValid').mockReturnValueOnce();
        jest.spyOn(databaseFn, 'database');

        try {
            openDatabase(validDatabase);
        } catch (e) {
            expect(true).toBe(false);
        }

        expect(databaseFn.database).toHaveBeenCalledWith(validDatabase, undefined);
    });

    it('opens database when valid data and size are passed', async () => {
        jest.spyOn(dataValidators, 'isSizeLimitValid').mockReturnValueOnce(true);
        jest.spyOn(dataValidators, 'isDataSizeNotExceeded').mockReturnValueOnce();
        jest.spyOn(dataValidators, 'isDataSchemaValid').mockReturnValueOnce();
        jest.spyOn(databaseFn, 'database');

        try {
            openDatabase(validDatabase, 20);
        } catch (e) {
            expect(true).toBe(false);
        }

        expect(databaseFn.database).toHaveBeenCalledWith(validDatabase, 20);
    });

    it('throws error when opening database with invalid data passed and no size limit set', async () => {
        jest.spyOn(dataValidators, 'isDataSchemaValid').mockImplementationOnce(() => {
            throw new InternalError(DatabaseError.DataSchemaMismatch, 'Collection is not an array');
        });

        try {
            openDatabase(invalidDatabase as unknown as DatabaseData);
        } catch (e) {
            console.log('invalid schema', e);
            expect(e.name).toBe(DatabaseError.DataSchemaMismatch);
            expect(e.message).toContain('Collection is not an array');
        }
    });

    it('throws error when opening database with valid data and invalid size limit passed', async () => {
        jest.spyOn(dataValidators, 'isSizeLimitValid').mockImplementationOnce(() => {
            throw new InternalError(DatabaseError.DataSizeLimitFormatError, 'Data size limit is not a positive integer');
        });

        try {
            openDatabase(validDatabase, -20);
        } catch (e) {
            console.log('invalid size', e);
            expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
            expect(e.message).toContain('Data size limit is not a positive integer');
        }
    });

    it('throws error when opening database with valid data passed but data exceeds passed limit', async () => {
        const sizeLimit = 1;

        jest.spyOn(dataValidators, 'isSizeLimitValid').mockReturnValueOnce(true);
        jest.spyOn(dataValidators, 'isDataSizeNotExceeded').mockImplementationOnce(() => {
            throw new InternalError(DatabaseError.DataSizeExceeded, `Database size exceeds limit: ${sizeLimit}MB`);
        });

        try {
            openDatabase(validDatabase, sizeLimit);
        } catch (e) {
            console.log('exceeded size', e);
            expect(e.name).toBe(DatabaseError.DataSizeExceeded);
            expect(e.message).toContain(`Database size exceeds limit: ${sizeLimit}MB`);
        }
    });
});