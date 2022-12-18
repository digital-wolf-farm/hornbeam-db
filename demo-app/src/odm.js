const path = require('path');
// const { readFile, writeFile } = require('node:fs/promises');
const { promises: fs } = require("fs");

const { openDatabase } = require('../../dist/lib/cjs/index');

module.exports = function odmService() {
    const dbFilePath = path.resolve(__dirname, '..', 'db-files', 'books.json');

    // Initializing database
    let db;


    // Read file
    async function readDatabase() {
        let fileContent;

        if (!db) {
            fileContent = await fs.readFile(dbFilePath, { encoding: 'utf-8' });
        }

        return JSON.parse(fileContent);
    }

    // Save file
    async function saveDatabase(data) {
        await fs.writeFile(dbFilePath, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    }

    // Functions to be called in server's services
    async function getBooks() {
        try {
            if (!db) {
                const data = await readDatabase();
                console.log('data', data);
                db = openDatabase(data);
            }
            const collection = db.getCollection('');
            return collection.findMultiple().results();
        } catch (e) {
            console.log('getBooks error', e);
            throw e;
        }
    }

    async function findBook(id) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
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
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('authors');
            return collection
                .findMultiple({ or: [{ 'country': { eq: 'pl' } }, { 'surname': { eq: 'King' } }] })
                // .sort('_id:-1',)
                // .limit(2, 1)
                .results();
        } catch (e) {
            console.log('findBooks error', e);
            throw e;
        }
    }

    async function addBook(book) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('books', ['title']);
            const addedEntryId = collection.insert(book);
            const changedData = db.returnData();
            await saveDatabase(changedData);

            return addedEntryId;
        } catch (e) {
            console.log('addBook error', e);
            throw e;
        }
    }

    async function addBooks(books) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('books', ['title']);
            const addedEntriesId = collection.insertMultiple(books);
            const changedData = db.returnData();
            await saveDatabase(changedData);
            return addedEntriesId;
        } catch (e) {
            console.log('addBooks error', e);
            throw e;
        }
    }

    async function editBook(book) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('books', ['title']);
            const replacedEntryId = collection.replace(book);
            const changedData = db.returnData();
            await saveDatabase(changedData);
            return replacedEntryId;
        } catch (e) {
            console.log('editBook error', e);
            throw e;
        }
    }

    async function removeBook(id) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('books');
            const removedEntryId = collection.remove(id);
            const changedData = db.returnData();
            await saveDatabase(changedData);
            return removedEntryId;
        } catch (e) {
            console.log('removeBook error', e);
            throw e;
        }
    }

    async function removeBooks(ids) {
        try {
            if (!db) {
                const data = await readDatabase();
                db = openDatabase(data);
            }
            const collection = db.getCollection('books');
            console.warn('ids', ids);
            const removedEntriesId = collection.removeMultiple(ids);
            const changedData = db.returnData();
            await saveDatabase(changedData);
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
