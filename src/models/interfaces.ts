import { FilterType } from './enums';

export interface DBConfiguration {
    dbSize: number;
    collectionNameMinLength: number;
    collectionNameMaxLength: number;
}

export interface DB {
    open(path: string): Promise<void>;
    save(): Promise<void>;
    close(): void;
    stats(): string;
    insert(collectionName: string, data: object, uniqueFields?: string[]): number;
    find(collectionName: string, query: Query[] | [], options?: FindOptions): FindResults;
    replace(collectionName: string, query: Query[], data: object, uniqueFields?: string[]): number;
    remove(collectionName: string, query: Query[]): number;
}

export interface DBAPI extends DB {
    findById(collectionName: string, id: number): Entry;
    replaceById(collectionName: string, id: number, data: object, uniqueFields?: string[]): number;
    removeById(collectionName: string, id: number): number;
}

export interface DBData {
    [collectionName: string]: Entry[];
}

export interface CachedDB {
    path: string;
    data: DBData;
}

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
