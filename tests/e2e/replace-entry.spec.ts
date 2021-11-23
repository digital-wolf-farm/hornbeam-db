import { DB } from '../../src/models/interfaces';
import { DBTaskError } from '../../src/models/enums';
import hornbeamDB from '../../src/index';

describe.skip('Replace entry', () => {
    let db: DB;

    beforeEach(() => {
        db = hornbeamDB();
    });

    afterEach(() => {

    });

    it('should throw error when collection name is not a string', async () => {
        try {
            db.replace(1, [], {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when query value is not a valid array', async () => {
        try {
            db.replace('collection1', 'id', {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when replaced entry value is not an object', async () => {
        try {
            db.replace('collection1', [], 'new-data');
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when options object is invalid', async () => {
        try {
            db.replace('collection1', [], {}, { options: undefined });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            db.replace('$collection-1', [], {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });

    it('should throw error when arguments are valid but db is not open', async () => {
        try {
            db.replace('collection1', [{ type: 'eq', field: '_id', value: '1' }], { 'name': 'Jan' });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            await db.open('tests/e2e/test-db.json');
            const results = db.replace('collection1', [{ type: 'eq', field: 'address.city', value: 'Gdańsk' }], {name: 'Wiktoria', age: 59});
            console.log(results);
            await db.save();
            // expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });
});
