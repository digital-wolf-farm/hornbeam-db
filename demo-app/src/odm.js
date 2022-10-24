const path = require('path');

const { openDB } = require('../../dist/lib/cjs/index');

module.exports = function odmService() {

    // Initializing database
    let db;

    // Functions to be called in server's services
    async function getBooks() {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books');
            return collection.findMultiple().results();
        } catch (e) {
            console.log('getAuthors error', e);
            throw e;
        }
    }

    async function findBook(id) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books');
            return collection.find(id);
        } catch (e) {
            console.log('findBook error', e);
            throw e;
        }
    }

    async function findBooks(query) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books');
            return collection.findMultiple().sort('_id:-1', ).limit(2, 4).results();
        } catch (e) {
            console.log('findBooks error', e);
            throw e;
        }
    }

    async function addBook(book) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books', { indexes: ['title'] });
            const addedEntryId = collection.insert(book);
            await db.saveData();
            return addedEntryId;
        } catch (e) {
            console.log('addBook error', e);
            throw e;
        }
    }

    async function addBooks(books) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books', { indexes: ['title'] });
            const addedEntriesId = collection.insertMultiple(books);
            await db.saveData();
            return addedEntriesId;
        } catch (e) {
            console.log('addBooks error', e);
            throw e;
        }
    }

    async function editBook(book) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books', { indexes: ['title'] });
            const replacedEntryId = collection.replace(book);
            await db.saveData();
            return replacedEntryId;
        } catch (e) {
            console.log('editBook error', e);
            throw e;
        }
    }

    async function removeBook(id) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books');
            const removedEntryId = collection.remove(id);
            await db.saveData();
            return removedEntryId;
        } catch (e) {
            console.log('removeBook error', e);
            throw e;
        }
    }

    async function removeBooks(ids) {
        try {
            if (!db) {
                db = await openDB(path.resolve(__dirname, '..', 'db-files', 'books.json'));
            }
            const collection = db.getCollection('books');
            console.warn('ids', ids);
            const removedEntriesId = collection.removeMultiple(ids);
            await db.saveData();
            return removedEntriesId;
        } catch (e) {
            console.log('removeBooks error', e);
            throw e;
        }
    }

    return {
        getBooks,
        findBook,
        findBooks,
        addBook,
        addBooks,
        editBook,
        removeBook,
        removeBooks
    }
}
