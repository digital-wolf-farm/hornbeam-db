import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HornbeamAPI } from '../models/interfaces';
import { database } from './database';
import * as collectionFn from './collection';
import { HornbeamError, InternalError } from '../utils/errors';
import { DBMethod, DatabaseError } from '../models/enums';
import { dataValidators } from '../validators/data-validators';

describe('Database', () => {
    const data = {
        users: [{ _id: 1, name: 'Adam' }],
        devices: [
            { _id: 1, label: 'TV set' },
            { _id: 3, label: 'Walkie-talkie' }
        ],
        addresses: []
    };

    let db: HornbeamAPI;

    vi.spyOn(collectionFn, 'collection');

    beforeEach(() => {
        db = database(data);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get collection', () => {
        it('throws error when getting collection with non-string name', () => {
            const expectedError = new HornbeamError(DatabaseError.CollectionNameError, DBMethod.GetCollection, 'Collection name is not a string')
            
            const resultFn = () => { db.getCollection(1 as unknown as string) };
    
            expect(resultFn).toThrow(expectedError);
            expect(collectionFn.collection).not.toHaveBeenCalled();
        });
    
        it('throws error when getting collection with proper name but uniqueField property is not a string', () => {
            const expectedError = new HornbeamError(DatabaseError.CollectionOptionsError, DBMethod.GetCollection, 'Unique field is not a string')
            
            const resultFn = () => { db.getCollection('users', 2 as unknown as string) };
    
            expect(resultFn).toThrow(expectedError);
            expect(collectionFn.collection).not.toHaveBeenCalled();
        });
    
        it('opens empty collection when passed name not found in database', () => {
            db.getCollection('jobs');
    
            expect(collectionFn.collection).toHaveBeenCalledWith([], undefined);
        });
    
        it('opens stored collection when passed name found in database', () => {
            db.getCollection('users');
    
            expect(collectionFn.collection).toHaveBeenCalledWith(data.users, undefined);
        });
    
        it('opens stored collection with defined unique field when passed name found in database', () => {
            db.getCollection('devices', 'label');
    
            expect(collectionFn.collection).toHaveBeenCalledWith(data.devices, 'label');
        });
    });

    describe('export data', () => {
        it('returns database raw data with removed empty collections when schema is valid', () => {
            vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {});

            const exportedData = db.exportData();

            expect(exportedData).toEqual({
                users: [{ _id: 1, name: 'Adam' }],
                devices: [
                    { _id: 1, label: 'TV set' },
                    { _id: 3, label: 'Walkie-talkie' }
                ]
            });
        });

        it('throws error when data schema is invalid', () => {
            const expectedError = new HornbeamError(DatabaseError.DataSchemaMismatch, DBMethod.ExportData, 'Entry _id is not unique')
            vi.spyOn(dataValidators, 'isDataSchemaValid').mockImplementation(() => {
                throw new InternalError(DatabaseError.DataSchemaMismatch, 'Entry _id is not unique');
            });
    
            const resultFn = () => { db.exportData() };
    
            expect(resultFn).toThrow(expectedError);
        });
    });
});
