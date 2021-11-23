import { DB } from '../../src/models/interfaces';
import { DBTaskError } from '../../src/models/enums';
import hornbeamDB from '../../src/index';

describe.only('Remove entry', () => {
    let db: DB;

    beforeEach(() => {
        db = hornbeamDB();
    });

    afterEach(() => {

    });

    it('should throw error when collection name is not a string', async () => {
        try {
            db.remove(1, []);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when query value is not a valid query', async () => {
        try {
            db.remove('collection1', 'id');
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            db.remove('$collection-1', []);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });

    it('should throw error when arguments are valid but db is not open', async () => {
        try {
            db.remove('collection1', [{ type: 'eq', field: '_id', value: '1' }]);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
        }
    });

    it.only('should throw error when collection name is invalid', async () => {
        try {
            await db.open('tests/e2e/test-db.json');
            const results = db.remove('collection1', [{ type: 'eq', field: 'address.city', value: 'Gdańsk' }]);
            console.log(results);
            await db.save();
            // expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });
});
