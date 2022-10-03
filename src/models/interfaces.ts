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
    insert(data: NewEntry): number;
    insertMultiple(data: NewEntry[]): number[];
    find(id: number): Entry;
    findMultiple(query: Query[]): Entry[];
    replace(data: Entry): number;
    remove(id: number): number;
    removeMultiple(ids: number[]): number[];
}

export interface CollectionOptions {
    indexes: string[];
}

export interface CollectionIndexes {
    [index: string]: unknown[];
}

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
