import { ArrayFilters, BasicFilters, LogicalFilters, NumberFilters, TextFilters } from './enums';
import { Query, SortingField } from './types';

export interface DatabaseAPI {
    getCollection(name: string, uniqueFields?: string[]): Collection;
    getStats(): DatabaseStats;
    returnData(): DatabaseData;
}

export interface DatabaseData {
    [collectionName: string]: Entry[];
}

export interface DatabaseStats {
    sizeLimit: string;
    inUse: string;
}

export interface Collection {
    insert(data: NewEntry): number;
    get(id: number): Entry;
    find(query?: Query): FindMethods;
    replace(data: Entry): number;
    remove(id: number): number;
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

export interface CollectionIndexes {
    [index: string]: unknown[];
}

export interface NewEntry {
    _id?: never;
    [field: string]: unknown;
}

export interface Entry {
    _id: number;
    [field: string]: unknown;
}

export interface QueryExpression {
    [field: string]: {
        [key in BasicFilters | NumberFilters | ArrayFilters | TextFilters]?: unknown
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
