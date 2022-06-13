import { DB } from '../../src/models/interfaces';
import { DBTaskError } from '../../src/models/enums';
import hornbeamDB from '../../src/index';

describe('Insert entry', () => {
    let db: DB;

    beforeEach(() => {
        db = hornbeamDB();
    });

    afterEach(() => {

    });

    it('should throw error when collection name is not a string', async () => {
        try {
            db.insert(1, {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when data value is not an object', async () => {
        try {
            db.insert('collection1', 'data');
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when options object is invalid', async () => {
        try {
            db.insert('collection1', { 'name': 'Adam' }, { options: undefined });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            db.insert('$collection-1', { 'name': 'Adam' });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });

    it('should throw error when arguments are valid but db is not open', async () => {
        try {
            db.insert('collection1', {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            await db.open('tests/e2e/test-db.json');
            db.insert('collection1', { 'name': 'Krzysztof', address: { city: 'Gdańsk' } }, { unique: ['address.main.postal'] });
            await db.save();
            expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });
});
