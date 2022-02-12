import { FilterType } from './enums';

export interface DBConfiguration {
    dbSize: number;
    collectionNameMinLength: number;
    collectionNameMaxLength: number;
}

export interface DBAPI {
    insert(collectionName: unknown, data: unknown, options?: unknown): number;
    find(collectionName: unknown, query: unknown, options?: unknown): FindResults;
    findById(collectionName: unknown, id: number): Entry;
    replace(collectionName: unknown, id: unknown, data: unknown, options?: unknown): number;
    remove(collectionName: unknown, id: unknown): number;
    open(path: unknown): Promise<void>;
    save(): Promise<void>;
    close(): void;
    stat(): string;
}

export interface DB {
    insert(collectionName: string, data: object, options?: InsertOptions): number;
    find(collectionName: string, query: Query[], options?: FindOptions): FindResults;
    replace(collectionName: string, id: number, data: object, options?: ReplaceOptions): number;
    remove(collectionName: string, id: number): number;
    open(path: string): Promise<void>;
    save(): Promise<void>;
    close(): void;
    stat(): string;
}

export interface DBData {
    [collectionName: string]: Entry[];
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

export interface InsertOptions {
    unique: string[];
}

export interface ReplaceOptions {
    unique: string[];
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
