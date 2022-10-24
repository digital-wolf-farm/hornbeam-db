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
    findMultiple(query?: Query): FindMethods;
    replace(data: Entry): number;
    remove(id: number): number;
    removeMultiple(ids: number[]): number[];
}

// TODO: Make interfaces DRY
export interface LimitMethods {
    results(): FindResults;
}

export interface SortMethods {
    results(): FindResults;
    limit(resultsSize: number, skippedEntries: number): LimitMethods;
}

export interface FindMethods {
    results(): FindResults;
    sort(param: SortingField, languageCode?: string): SortMethods;
    limit(resultsSize: number, skippedEntries: number): LimitMethods;
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

export interface Query {
    field: {
        [key in FilterType]: unknown
    }
}

export interface FindResults {
    data: Entry[];
    info?: {
        total: number;
        size: number;
        skipped: number;
    };
}

export type SortingField = `${string}:${'-1' | '+1'}`;
