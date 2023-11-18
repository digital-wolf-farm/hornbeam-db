import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HornbeamAPI } from '../models/interfaces';
import { database } from './database';
import * as collectionFn from './collection';
import { HornbeamError } from '../utils/errors';
import { DBMethod, DatabaseError } from '../models/enums';

describe('database', () => {
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
        vi.resetAllMocks();
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

    // describe('export data', () => {
        
    // });
});
