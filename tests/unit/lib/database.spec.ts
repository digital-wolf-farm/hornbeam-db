import { createDB } from '../../../src/lib/database';
import { fileOperations } from '../../../src/lib/file-operations';
import { DBTaskError } from '../../../src/models/enums';
import { DBData } from '../../../src/models/interfaces';
import { DBConfig } from '../../../src/utils/db-config';
import { mockedDB } from '../mocked-data/mocked-db';

describe('Database', () => {
    let db;

    describe('Find', () => {
        beforeEach(() => {
            db = createDB(new DBConfig());
        });

        afterEach(() => {
            db.close();
        });

        it('should throw error when database is not open', () => {
            try {
                db.find('collection1', []);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
            }
        });

        it('should throw error when database is open but collection doesn\'t exist', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({});

            try {
                await db.open('any/path');
                db.find('collection1', []);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNotExists);
            }
        });

        it('should return whole collection when no query passed', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', []);
            expect(results.pagination).toBe(undefined);
            expect(results.data.length).toBe(7);
        });

        // Query with not nested field

        it('should return filtered collection when query passed', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [{ type: 'eq', field: 'address.city', value: 'New York' }]);
            expect(results.pagination).toBe(undefined);
            expect(results.data.length).toBe(1);
            expect(results.data[0].name).toBe('Macmillan Inc.');
        });

        // Multiple query
        // Not existing query

        // Sort by string
        // Sort by number
        // Sort by null
        // Sort by undefined
        // Sort by date
        // Sort by boolean
        // Sort by other type - throw error

        it('should sort results by one condition with ascending order', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'founded', order: 1 }] });
            expect(results.data[0].name).toBe('Cambridge University Press');
            expect(results.data[6].name).toBe('Świat Książki');
        });

        it('should sort results by one condition with descending order', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'founded', order: -1 }] });
            expect(results.data[0].name).toBe('Świat Książki');
            expect(results.data[6].name).toBe('Cambridge University Press');
        });

        it('should sort results by one condition with nested field', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'address.country', order: 1 }] });
            expect(results.data[0].name).toBe('Cambridge University Press');
            expect(results.data[6].name).toBe('Macmillan Inc.');
        });

        it('should sort result by multiple conditions with different orders', async() => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'address.city', order: -1 }, { field: 'name', order: 1 }] });
            expect(results.data[0].name).toBe('PWN');
            expect(results.data[6].name).toBe('Harvard University Press');
        });

        it('should not sort when passed not existing field as first condition', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'owner', order: 1 }] });
            expect(results.data[0].name).toBe('PWN');
            expect(results.data[6].name).toBe('Macmillan Inc.');
        });

        it('should sort only for valid conditions when passed not existing field as subsequent condition', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { sort: [{ field: 'founded', order: 1 }, { field: 'owner', order: 1 }] });
            expect(results.data[0].name).toBe('Cambridge University Press');
            expect(results.data[6].name).toBe('Świat Książki');
        });

        it('should return paginated results for first page', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { page: { pageNumber: 1, pageSize: 2 } });
            expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 1, pageSize: 2 });
            expect(results.data.length).toBe(2);
            expect(results.data[0].name).toBe('PWN');
            expect(results.data[1].name).toBe('Świat Książki');
        });

        it('should return paginated results for last page', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { page: { pageNumber: 4, pageSize: 2 } });
            expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 4, pageSize: 2 });
            expect(results.data.length).toBe(1);
            expect(results.data[0].name).toBe('Macmillan Inc.');
        });

        it('should return no results for page after last', async () => {
            jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

            await db.open('any/path');
            const results = db.find('publishers', [], { page: { pageNumber: 5, pageSize: 2 } });
            expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 5, pageSize: 2 });
            expect(results.data.length).toBe(0);
        });
    });
});
