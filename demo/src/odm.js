import { promises as fs } from 'fs';

import loggerService from './logger.js';
import hornbeamDB from '../../src/hornbeam-db.js';

export default function odmService() {

    // Initializing logger for database and database
    const dbLogger = loggerService('Database');
    const db = hornbeamDB(fs, dbLogger);

    // Functions to be called in server's services
    async function getAuthors() {
        try {
            await db.openDatabase('./demo/db-files', 'books');
            const queries = [{
                type: 'eq',
                field: 'country',
                value: 'pl'
            }];
            const options = {
                // pagination: {
                //     pageSize: 3,
                //     currentPage: 1
                // },
                sorting: [{
                    field: 'country',
                    order: 'asc'
                }, {
                    field: 'surname',
                    order: 'desc'
                }]
            };
            const results = db.findEntries('authors', queries);
            db.closeDatabase();
            return results;
        } catch (e) {
            console.log('get authors error', e);
            throw e;
        }
    }

    async function addAuthor(author) {
        try {
            await db.openDatabase('./src/files/default', 'books');
            db.addEntry('authors', author);
            await db.save();
        } catch (e) {
            console.log('add authors error', e);
            throw e;
        }
    }

    async function addPublisher(publisher) {
        try {
            await db.openDatabase('./files/default', 'books');
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
            await db.openDatabase('./files/default', 'books');
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

            await db.openDatabase('./files/default', 'books');
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

            await db.openDatabase('./files/default', 'books');
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
            await db.openDatabase('./files/default', 'books');
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
