import { DB } from '../../src/models/interfaces';
import { DBTaskError } from '../../src/models/enums';
import hornbeamDB from '../../src/index';

describe.only('Add entry', () => {
    let db: DB;

    beforeEach(() => {
        db = hornbeamDB();
    });

    afterEach(() => {

    });

    it ('should throw error when db is not open', async () => {
        try {
            db.add('collection1', {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
        }
    });

    it ('should throw error when collection name is invalid', async () => {
        try {
            await db.open('test-db.json');
            db.add(1, {});
            expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
        }
    });
});
