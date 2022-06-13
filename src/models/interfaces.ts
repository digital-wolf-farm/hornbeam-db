import { FilterType } from './enums';

export interface Client {
    open(path: string): Promise<DatabaseAPI>;
}

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
    limit: string;
    usage: string;
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

export interface PaginationResults {
    entriesNumber: number;
    pagesNumber: number;
    pageNumber: number;
    pageSize: number;
}

export interface FindResults {
    data: Entry[];
    pagination?: PaginationResults;
}

export interface PaginationOptions {
    pageNumber: number;
    pageSize: number;
}

export interface SortingOptions {
    field: string;
    order: 1 | -1;
}

export interface FindOptions {
    page?: PaginationOptions;
    sort?: SortingOptions[];
}

export interface Query {
    type: FilterType;
    field: string;
    value: unknown;
}

export interface CollectionNameConfig {
    minLength: number;
    maxLength: number;
}
