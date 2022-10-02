import { FilterType } from './enums';

export interface DatabaseAPI {
    getCollection(name: string, options: CollectionOptions): Collection;
    getStats(): DatabaseStats;
    saveData(): Promise<void>;
}

export interface DatabaseInfo {
    path: string;
    dbSizeLimit: number;
}

export interface Database {
    [collectionName: string]: Entry[];
}

export interface DatabaseStats {
    sizeLimit: string;
    inUse: string;
}

export interface Collection {
    insert(data: NewEntry, uniqueFields?: string[]): number;
    find(query: [] | Query[]): Entry[];
    replace(id: number, data: Entry, uniqueFields?: string[]): number;
    remove(id: number): number;
}

export interface CollectionOptions {
    indexes: string[];
}

export interface CollectionIndexes {
    [index: string]: unknown[];
}

// export interface DBAPI extends DB {
//     findById(collectionName: string, id: number): Entry;
//     replaceById(collectionName: string, id: number, data: object, uniqueFields?: string[]): number;
//     removeById(collectionName: string, id: number): number;
// }



// export interface CachedDB {
//     path: string;
//     data: DBData;
// }

export interface NewEntry {
    _id: never;
    [field: string]: unknown;
}

export interface Entry {
    _id: number;
    [field: string]: unknown;
}

export interface SortingOptions {
    field: string;
    order: 1 | -1;
}

export interface Query {
    field: {
        [key in FilterType]: unknown
    }
}
