import { afterEach, describe, expect, it, vi } from 'vitest';
import { HornbeamData, hornbeamDb } from '.';
import * as databaseFn from './lib/database';
import { DBMethod, DatabaseError } from './models/enums';
import { HornbeamError, InternalError } from './utils/errors';
import { dataValidators } from './validators/data-validators';

describe('HornbeamDB', () => {
    const validDatabase = { collection1: [{ _id: 1, name: 'Adam' }] };
    const invalidDatabase = { collection1: { _id: 1, name: 'Adam' } };

    vi.spyOn(databaseFn, 'database');

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('opens database when valid data is loaded', () => {
        vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {});

        hornbeamDb.loadData(validDatabase);

        expect(databaseFn.database).toHaveBeenCalledWith(validDatabase);
    });

    it('throws error when loading invalid data', () => {
        const expectedError = new HornbeamError(DatabaseError.DataSchemaMismatch, DBMethod.LoadData, 'Collection is not an array')
        vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {
            throw new InternalError(DatabaseError.DataSchemaMismatch, 'Collection is not an array');
        });

        const resultFn = () => { hornbeamDb.loadData(invalidDatabase as unknown as HornbeamData) };

        expect(resultFn).toThrow(expectedError);
        expect(databaseFn.database).not.toHaveBeenCalled();
    });
});
