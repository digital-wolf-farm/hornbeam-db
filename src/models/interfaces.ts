import { ArrayFilters, BasicFilters, LogicalFilters, NumberFilters, TextFilters } from './enums';
import { Query, SortingField } from './types';

export interface HornbeamAPI {
    getCollection(name: string, uniqueField?: string): Collection;
    exportData(): HornbeamData;
}

export interface HornbeamData {
    [collectionName: string]: Entry[];
}

export interface Collection {
    insert(entry: InsertedEntry): number;
    get(id: number): Entry | undefined;
    find(query?: Query): FindMethods;
    replace(entry: Entry): number | undefined;
    remove(id: number): number | undefined;
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

export interface InsertedEntry {
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
