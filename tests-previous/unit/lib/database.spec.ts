import createDB from '../../../src-previous/lib/database';
import { DBTaskError } from '../../../src-previous/models/enums';
import { DBData } from '../../../src-previous/models/interfaces';

describe('Database', () => {

    describe('cacheData()', () => {
        let db: any;

        const exampleDB: DBData = {
            collection1: [{ _id: 1, name: 'John' }, { _id: 2, name: 'Judi' }],
            collection2: [{ _id: 1, label: 'Fridge' }, { _id: 2, label: 'Car' }]
        }

        const examplePath = 'path/to/file';

        beforeEach(() => {
            db = createDB();
        });

        it('should store database in cache when validated path and data are passed', () => {
            db.cacheData(examplePath, exampleDB);

            expect(db.getData()).toEqual({ path: examplePath, data: exampleDB });
        });
    });

    describe('clearData()', () => {
        let db: any;

        const exampleDB: DBData = {
            collection1: [{ _id: 1, name: 'John' }, { _id: 2, name: 'Judi' }],
            collection2: [{ _id: 1, label: 'Fridge' }, { _id: 2, label: 'Car' }]
        }

        const examplePath = 'path/to/file';

        beforeEach(() => {
            db = createDB();
        });

        it('should clear database cache when function called', () => {
            db.cacheData(examplePath, exampleDB);

            db.clearData();

            try {
                db.getData();

                expect(true).toEqual(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
            }
        });
    });

    describe('getData()', () => {
        let db: any;

        const exampleDB: DBData = {
            collection1: [{ _id: 1, name: 'John' }, { _id: 2, name: 'Judi' }],
            collection2: [{ _id: 1, label: 'Fridge' }, { _id: 2, label: 'Car' }]
        }

        const examplePath = 'path/to/file';

        beforeEach(() => {
            db = createDB();
        });

        it('should throw error when no data cached and function called', () => {
            try {
                db.getData();

                expect(true).toEqual(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
            }
        });

        it('should return cached path and data when data cached and function called', () => {
            db.cacheData(examplePath, exampleDB);

            expect(db.getData()).toEqual({ path: examplePath, data: exampleDB });
        });
    });

    describe('getStats()', () => {
        let db: any;

        const exampleDB: DBData = {};
        const examplePath = 'path/to/file';

        beforeEach(() => {
            db = createDB();
        });

        it('should throw error when no data cached and function called', () => {
            try {
                db.getStats();

                expect(true).toEqual(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
            }
        });

        it('should return used space in MB when data cached and function called', () => {
            db.cacheData(examplePath, exampleDB);

            expect(db.getStats()).toEqual('0.000');
        });
    });

    describe('insertEntry()', () => {
        let db: any;

        const examplePath = 'path/to/file';

        beforeEach(() => {
            db = createDB();
        });

        afterEach(() => {
            db.clearData();
        });

        it('should throw error when no data cached and attempt to insert entry', () => {
            try {
                db.insertEntry('collection1', {});

                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
            }
        });

        it('should add entry with _id = 1 when collection does not exist', () => {
            db.cacheData(examplePath, {});

            const entryId = db.insertEntry('collection1', { name: 'John' });

            expect(entryId).toBe(1);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection1: [{ _id: 1, name: 'John' }] } }));
        });

        it('should add entry with _id = 1 when collection exists but is empty', () => {
            db.cacheData(examplePath, { 'collection1': [] });

            const entryId = db.insertEntry('collection1', { name: 'John' });

            expect(entryId).toBe(1);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection1: [{ _id: 1, name: 'John' }] } }));
        });

        it('should add entry with proper _id when collection exists', () => {
            db.cacheData(examplePath, { 'collection2': [{ _id: 98, label: 'car' }] });

            const entryId = db.insertEntry('collection2', { label: 'bike' });

            expect(entryId).toBe(99);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection2: [{ _id: 98, label: 'car' }, { _id: 99, label: 'bike' }] } }));
        });

        it('should add entry with not unique data when no unique field is listed', () => {
            db.cacheData(examplePath, { 'collection2': [{ _id: 98, label: 'car' }] });

            const entryId = db.insertEntry('collection2', { label: 'car' });

            expect(entryId).toBe(99);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection2: [{ _id: 98, label: 'car' }, { _id: 99, label: 'car' }] } }));
        });

        it('should add entry with unique data when unique field is listed', () => {
            db.cacheData(examplePath, { 'collection2': [{ _id: 98, label: 'car' }] });

            const entryId = db.insertEntry('collection2', { label: 'bike' }, ['label']);

            expect(entryId).toBe(99);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection2: [{ _id: 98, label: 'car' }, { _id: 99, label: 'bike' }] } }));
        });

        it('should add entry with not unique data when not existing unique field is listed', () => {
            db.cacheData(examplePath, { 'collection2': [{ _id: 98, label: 'car' }] });

            const entryId = db.insertEntry('collection2', { label: 'bike' }, ['price']);

            expect(entryId).toBe(99);
            expect(expect(db.getData()).toEqual({ path: examplePath, data: { collection2: [{ _id: 98, label: 'car' }, { _id: 99, label: 'bike' }] } }));
        });

        // it('should add entry with proper id when restricted not nested field is provided', async () => {
        //     const dbTemp = { 'contractors': [{ _id: 100, name: 'Building Inc.' }] };
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(dbTemp);

        //     await db.open('any/path');
        //     const result = db.insert('contractors', { name: 'Cheaper Building Inc.' }, { unique: ['name'] });
        //     expect(result).toBe(101);
        // });

        // it('should add entry with proper id when restricted nested field is provided', async () => {
        //     const dbTemp = { 'contractors': [{ _id: 10, name: 'Building Inc.', address: { city: 'Paris' } }] };
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(dbTemp);

        //     await db.open('any/path');
        //     const result = db.insert('contractors', { name: 'Cheaper Building Inc.', address: { city: 'Amsterdam' } }, { unique: ['address.city'] });
        //     expect(result).toBe(11);
        // });

        // it('should add entry with proper id when multiple restricted fields are provided', async () => {
        //     const dbTemp = { 'contractors': [{ _id: 20, name: 'Building Inc.', address: { city: 'Paris' } }] };
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(dbTemp);

        //     await db.open('any/path');
        //     const result = db.insert('contractors', { name: 'Cheaper Building Inc.', address: { city: 'Amsterdam' } }, { unique: ['name', 'address.city'] });
        //     expect(result).toBe(21);
        // });

        // it('should add entry with proper id when restricted not existing field is provided', async () => {
        //     const dbTemp = { 'contractors': [{ _id: 30, name: 'Building Inc.' }] };
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(dbTemp);

        //     await db.open('any/path');
        //     const result = db.insert('contractors', { name: 'Cheaper Building Inc.' }, { unique: ['owner'] });
        //     expect(result).toBe(31);
        // });

        // it('should add entry with proper id when restricted field for not primitive value is provided', async () => {
        //     const dbTemp = { 'contractors': [{ _id: 40, name: 'Building Inc.', address: { city: 'Paris' } }] };
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(dbTemp);

        //     await db.open('any/path');
        //     const result = db.insert('contractors', { name: 'Cheaper Building Inc.', address: { city: 'Amsterdam' } }, { unique: ['address'] });
        //     expect(result).toBe(41);
        // });

        // it('should throw error when attempt to add data with the same value for resticted not nested field', async () => {
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

        //     try {
        //         await db.open('any/path');
        //         db.insert('contractors', { name: 'Building Inc.' }, { unique: ['name'] });
        //         expect(true).toBe(false);
        //     } catch (e) {
        //         expect(e.error).toBe(DBTaskError.FieldValueNotUnique);
        //     }
        // });

        // it('should throw error when attempt to add data with the same value for resticted nested field', async () => {
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

        //     try {
        //         await db.open('any/path');
        //         db.insert('contractors', { name: 'Sehr Gut Auto GMBH', address: { street: 'Kurfürstendamm' } }, { unique: ['address.street'] });
        //         expect(true).toBe(false);
        //     } catch (e) {
        //         expect(e.error).toBe(DBTaskError.FieldValueNotUnique);
        //     }
        // });

        // it('should throw error when attempt to add data with the same value for one of restricted fields', async () => {
        //     jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

        //     try {
        //         await db.open('any/path');
        //         db.insert('contractors', { name: 'Sehr Gut Auto GMBH', address: { street: 'Kurfürstendamm' } }, { unique: ['name', 'address.street'] });
        //         expect(true).toBe(false);
        //     } catch (e) {
        //         expect(e.error).toBe(DBTaskError.FieldValueNotUnique);
        //     }
        // });
    });

    // describe('Find', () => {
    //     beforeEach(() => {
    //         db = createDB(new DBConfig());
    //     });

    //     afterEach(() => {
    //         db.close();
    //     });

    //     it('should throw error when database is not open', () => {
    //         try {
    //             db.find('collection1', []);
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
    //         }
    //     });

    //     it('should throw error when database is open but collection doesn\'t exist', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({});

    //         try {
    //             await db.open('any/path');
    //             db.find('collection1', []);
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.CollectionNotExists);
    //         }
    //     });

    //     it('should return entire collection when no query passed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', []);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(7);
    //     });

    //     it('should return filtered collection when query with not nested field is passed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'founded', value: 1534 }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(1);
    //         expect(results.data[0].name).toBe('Cambridge University Press');
    //     });

    //     it('should return filtered collection when query with nested field is passed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'address.city', value: 'New York' }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(1);
    //         expect(results.data[0].name).toBe('Macmillan Inc.');
    //     });

    //     it('should return empty collection when query with not existing field is passed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'owner', value: 'Any' }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(0);
    //     });

    //     it('should return filtered collection when multiple query is passed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'address.country', value: 'United States' }, { type: 'eq', field: 'active', value: false }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(1);
    //         expect(results.data[0].name).toBe('Macmillan Inc.');
    //     });

    //     it('should return empty collection when multiple query is passed and first query contains not existing field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'owner', value: 'Any' }, { type: 'eq', field: 'active', value: false }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(0);
    //     });

    //     it('should return empty collection when multiple query is passed and last query contains not existing field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'active', value: true }, { type: 'eq', field: 'owner', value: 'Any' }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(0);
    //     });

    //     it('should return empty collection when query for non primitive value', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [{ type: 'eq', field: 'address', value: 'New York' }]);
    //         expect(results.pagination).toBe(undefined);
    //         expect(results.data.length).toBe(0);
    //     });

    //     it('should sort results by string', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'nickname', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Alex', 'Egg', 'Headshot', 'Italiano', 'Zebra']);
    //     });

    //     it('should sort results by number', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'age', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Headshot', 'Alex', 'Zebra', 'Egg', 'Italiano']);
    //     });

    //     it('should sort results by null/string', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'supervisor', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Zebra', 'Italiano', 'Headshot', 'Egg', 'Alex']);
    //     });

    //     it('should sort results by null/number', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'pets', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Alex', 'Italiano', 'Egg', 'Headshot', 'Zebra']);
    //     });

    //     it('should sort results by undefined/string', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'project', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Italiano', 'Zebra', 'Alex', 'Headshot', 'Egg']);
    //     });

    //     it('should sort results by boolean', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('team', [], { sort: [{ field: 'isManager', order: 1 }] });
    //         expect(results.data.map((item) => item.nickname)).toEqual(['Zebra', 'Italiano', 'Alex', 'Headshot', 'Egg']);
    //     });

    //     it('should throw error when attempt to sort by non primitive value', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         try {
    //             await db.open('any/path');
    //             db.find('team', [], { sort: [{ field: 'hobbies', order: 1 }] });
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.SortDataTypeError);
    //         }
    //     });

    //     it('should sort results by one condition with ascending order', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'founded', order: 1 }] });
    //         expect(results.data[0].name).toBe('Cambridge University Press');
    //         expect(results.data[6].name).toBe('Świat Książki');
    //     });

    //     it('should sort results by one condition with descending order', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'founded', order: -1 }] });
    //         expect(results.data[0].name).toBe('Świat Książki');
    //         expect(results.data[6].name).toBe('Cambridge University Press');
    //     });

    //     it('should sort results by one condition with nested field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'address.country', order: 1 }] });
    //         expect(results.data[0].name).toBe('Cambridge University Press');
    //         expect(results.data[6].name).toBe('Macmillan Inc.');
    //     });

    //     it('should sort result by multiple conditions with different orders', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'address.city', order: -1 }, { field: 'name', order: 1 }] });
    //         expect(results.data[0].name).toBe('PWN');
    //         expect(results.data[6].name).toBe('Harvard University Press');
    //     });

    //     it('should not sort when passed not existing field as first condition', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'owner', order: 1 }] });
    //         expect(results.data[0].name).toBe('PWN');
    //         expect(results.data[6].name).toBe('Macmillan Inc.');
    //     });

    //     it('should sort only for valid conditions when passed not existing field as subsequent condition', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { sort: [{ field: 'founded', order: 1 }, { field: 'owner', order: 1 }] });
    //         expect(results.data[0].name).toBe('Cambridge University Press');
    //         expect(results.data[6].name).toBe('Świat Książki');
    //     });

    //     it('should return paginated results for first page', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { page: { pageNumber: 1, pageSize: 2 } });
    //         expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 1, pageSize: 2 });
    //         expect(results.data.length).toBe(2);
    //         expect(results.data[0].name).toBe('PWN');
    //         expect(results.data[1].name).toBe('Świat Książki');
    //     });

    //     it('should return paginated results for last page', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { page: { pageNumber: 4, pageSize: 2 } });
    //         expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 4, pageSize: 2 });
    //         expect(results.data.length).toBe(1);
    //         expect(results.data[0].name).toBe('Macmillan Inc.');
    //     });

    //     it('should return no results for page after last', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce(mockedDB);

    //         await db.open('any/path');
    //         const results = db.find('publishers', [], { page: { pageNumber: 5, pageSize: 2 } });
    //         expect(results.pagination).toEqual({ entriesNumber: 7, pagesNumber: 4, pageNumber: 5, pageSize: 2 });
    //         expect(results.data.length).toBe(0);
    //     });
    // });

    // describe('Replace', () => {
    //     beforeEach(() => {
    //         db = createDB(new DBConfig());
    //     });

    //     afterEach(() => {
    //         db.close();
    //     });

    //     it('should throw error when database is not open', () => {
    //         try {
    //             db.replace('contractors', [], {});
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
    //         }
    //     });

    //     it('should throw error when database is open but collection doesn\'t exist', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ companies: [] });

    //         try {
    //             await db.open('any/path');
    //             db.replace('contractors', [], {});
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.CollectionNotExists);
    //         }
    //     });

    //     it('should throw error when attempt to replace entry with the same value as other entry for restricted not nested field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith' }, { _id: 16, name: 'John', surname: 'Wayne' }] });

    //         try {
    //             await db.open('any/path');
    //             db.replace('students', 15, { _id: 15, name: 'Anna', surname: 'Wayne' }, { unique: ['surname'] });
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.FieldValueNotUnique);
    //         }
    //     });

    //     it('should throw error when attempt to replace entry with the same value as other entry for restricted nested field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith', address: { city: 'LA' } }, { _id: 16, name: 'John', surname: 'Wayne', address: { city: 'SF' } }] });

    //         try {
    //             await db.open('any/path');
    //             db.replace('students', 15, { _id: 15, name: 'Anna', surname: 'Wayne', address: { city: 'SF' } }, { unique: ['address.city'] });
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.FieldValueNotUnique);
    //         }
    //     });

    //     it('should replace entry when no other entry contains the same value for restricted not nested field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith' }, { _id: 16, name: 'John', surname: 'Wayne' }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 15, { _id: 15, name: 'Anna Catherine', surname: 'Smith' }, { unique: ['surname'] });
    //         expect(result).toBe(0);
    //     });

    //     it('should replace entry when no other entry contains the same value for restricted nested field', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith', address: { city: 'LA' } }, { _id: 16, name: 'John', surname: 'Wayne', address: { city: 'SF' } }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 15, { _id: 15, name: 'Anna Catherine', surname: 'Smith', address: { city: 'LA' } }, { unique: ['address.city'] });
    //         expect(result).toBe(0);
    //     });

    //     it('should replace entry when restricted not nested field does not exist', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith' }, { _id: 16, name: 'John', surname: 'Wayne' }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 15, { _id: 15, name: 'Anna', surname: 'Wayne' }, { unique: ['grade'] });
    //         expect(result).toBe(0);
    //     });

    //     it('should replace entry when restricted nested field does not exist', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith' }, { _id: 16, name: 'John', surname: 'Wayne' }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 15, { _id: 15, name: 'Anna', surname: 'Wayne' }, { unique: ['address.city'] });
    //         expect(result).toBe(0);
    //     });

    //     it('should replace entry when restricted field is not a primitive value', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith', address: { city: 'LA' } }, { _id: 16, name: 'John', surname: 'Wayne', address: { city: 'SF' } }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 15, { _id: 15, name: 'Anna', surname: 'Wayne', address: { city: 'LA' } }, { unique: ['address'] });
    //         expect(result).toBe(0);
    //     });

    //     it('should replace entry when found in collection', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna' }, { _id: 16, name: 'John' }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 16);
    //         expect(result).toBe(1);
    //     });

    //     it('should not replace entry when not found in collection', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith', address: { city: 'LA' } }, { _id: 16, name: 'John', surname: 'Wayne', address: { city: 'SF' } }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 1001, { _id: 15, name: 'John', surname: 'Wayne JR.', address: { city: 'SF' } });
    //         expect(result).toBe(-1);
    //     });

    //     it('should preserve proper entryId even if in passed data is changed', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna', surname: 'Smith' }, { _id: 16, name: 'John', surname: 'Wayne' }] });

    //         await db.open('any/path');
    //         const result = db.replace('students', 16, { _id: 24, name: 'John', surname: 'Wayne JR.', address: { city: 'SF' } });
    //         expect(result).toBe(1);
    //         expect(db.find('students', [{ type: 'eq', field: 'name', value: 'John' }])['data'][0]['_id']).toBe(16);
    //     });
    // });

    // describe('Remove', () => {
    //     beforeEach(() => {
    //         db = createDB(new DBConfig());
    //     });

    //     afterEach(() => {
    //         db.close();
    //     });

    //     it('should throw error when database is not open', () => {
    //         try {
    //             db.remove('contractors', []);
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.DatabaseNotOpen);
    //         }
    //     });

    //     it('should throw error when database is open but collection doesn\'t exist', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ companies: [] });

    //         try {
    //             await db.open('any/path');
    //             db.remove('contractors', []);
    //             expect(true).toBe(false);
    //         } catch (e) {
    //             expect(e.error).toBe(DBTaskError.CollectionNotExists);
    //         }
    //     });

    //     it('should remove entry when found in collection', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'Anna' }, { _id: 16, name: 'John' }] });

    //         await db.open('any/path');
    //         const result = db.remove('students', 16);
    //         expect(result).toBe(1);
    //     });

    //     it('should not remove entry when not found in collection', async () => {
    //         jest.spyOn(fileOperations, 'read').mockResolvedValueOnce({ students: [{ _id: 15, name: 'John' }] });

    //         await db.open('any/path');
    //         const result = db.remove('students', 16);
    //         expect(result).toBe(-1);
    //     });
    // });
});
