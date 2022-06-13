import { DB } from '../../src/models/interfaces';
import { DBTaskError } from '../../src/models/enums';
import hornbeamDB from '../../src/index';

describe.skip('Find entries', () => {
    let db: DB;

    beforeEach(() => {
        db = hornbeamDB();
    });

    afterEach(() => {

    });

    it('should throw error when collection name is not a string', async () => {
        try {
            db.find(1, {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when query value is not a valid array', async () => {
        try {
            db.find('collection1', 'id');
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when options object is invalid', async () => {
        try {
            db.find('collection1', [], { options: undefined });
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.FunctionArgumentMismatch);
        }
    });

    it('should throw error when collection name is invalid', async () => {
        try {
            db.find('$collection-1', []);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });

    it('should throw error when arguments are valid but db is not open', async () => {
        try {
            db.find('collection1', []);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
        }
    });

    it.only('should throw error when collection name is invalid', async () => {
        try {
            await db.open('tests/e2e/test-db.json');
            const results = db.find('collection1', [{ type: 'eq', field: 'name', value: 'Zofia' }]);
            console.log(results);
            db.close();
            // expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });
});
