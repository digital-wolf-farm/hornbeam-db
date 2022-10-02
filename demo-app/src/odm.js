const path = require('path');

const { openDB } = require('../../dist/lib/cjs/index');

module.exports = function odmService() {

    // Initializing database
    let db;

    // Functions to be called in server's services
    async function getAuthors() {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
                // db = await openDB('../some/file.json');
            }
            const collection = db.getCollection(1);
            // const addedId = collection.insert({ bla: 'bla', xyz: 'abc' });
            console.log('Added Id', db.getStats());
            return collection.find([]);
            // return db.getStats();

            // client.log();
            // console.log('stats', db.stat());
            // db.close();
            // await db.save();
            // const queries = [{
            //     type: 'eq',
            //     field: 'footSize',
            //     value: 43
            // }];
            // const options = {
            //     // pagination: {
            //     //     pageSize: 3,
            //     //     currentPage: 1
            //     // },
            //     sorting: [{
            //         field: 'country',
            //         order: 'asc'
            //     }, {
            //         field: 'surname',
            //         order: 'desc'
            //     }]
            // };
            // const results = db.findEntries('authors', queries);
            // db.closeDatabase();
            // return results;
        } catch (e) {
            console.log('error', e.error);
            console.log('name', e.name);
            console.log('message', e.message);
            console.log('stack', e.stack);
            throw e;
        }
    }

    async function addAuthor(author) {
        try {
            await db.openDatabase('./demo/db-files', 'books');
            db.addEntry('authors', author, { unique: ['name'] });
            await db.saveDatabase();
        } catch (e) {
            console.log('add authors error', e);
            throw e;
        }
    }

    async function addPublisher(publisher) {
        try {
            await db.openDatabase('./demo/db-files', 'books');
            db.openTransaction();
            db.add('publishers', publisher);
            await db.closeTransaction();
        } catch (e) {
            console.log('add publishers error', e);
            throw e;
        }
    }

    async function addSeries(series) {
        try {
            await db.openDatabase('./demo/db-files', 'books');
            db.openTransaction();
            db.add('series', series);
            await db.closeTransaction();
        } catch (e) {
            console.log('add series error', e);
            throw e;
        }
    }

    async function removeSeries(data) {
        try {
            const queries = [{
                type: 'eq',
                field: '_id',
                value: data.id
            }];

            await db.openDatabase('./demo/db-files', 'books');
            db.openTransaction();
            db.remove('series', queries);
            await db.closeTransaction();
        } catch (e) {
            console.log('add series error', e);
            throw e;
        }
    }

    async function editSeries(data) {
        try {
            const queries = [{
                type: 'eq',
                field: '_id',
                value: data.id
            }];

            await db.openDatabase('./demo/db-files', 'books');
            db.openTransaction();
            db.replace('series', queries, data.data);
            await db.closeTransaction();
        } catch (e) {
            console.log('add series error', e);
            throw e;
        }
    }

    async function getBooks() {
        try {
            await db.openDatabase('./demo/db-files', 'books');
            db.openTransaction();
            const authors = db.read('authors', {}, {});
            const books = db.read('books', {}, {});

            for (let book of books) {
                for (let [index, author] of book.authors.entries()) {
                    const authorId = author;
                    const authorData = authors.filter((author) => {
                        return author.id === authorId
                    });

                    if (authorData.length === 0) {
                        throw 'Invalid data';
                    } else {
                        book.authors[index] = authorData[0];
                    }
                }
            }

            await db.closeTransaction();

            return books;
        } catch (e) {
            console.log('get books error', e);
            throw e;
        }
    }

    return {
        getAuthors,
        addAuthor,
        addPublisher,
        getBooks,
        addSeries,
        removeSeries,
        editSeries
    }
}
