import { FilterType } from './enums';

export interface Entry {
    [field: string]: any;
}

export interface DBData {
    [collectionName: string]: Entry[];
}

export interface DB {
    add(collectionName: unknown, data: unknown, options?: unknown): number;
    find(collectionName: unknown, query: unknown, options?: unknown): Entry[];
    replace(collectionName: unknown, query: unknown, data: unknown, options?: unknown): number;
    remove(collectionName: unknown, query: unknown): number;
    open(path: unknown): Promise<void>;
    save(): Promise<void>;
    close(): void;
    stat(): string;
}

export interface DBConfiguration {
    dbSize: number;
    collectionNameMinLength: number;
    collectionNameMaxLength: number;
}

export interface AddOptions {
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
    value: unknown; // TODO: Narrow down valid types of value field
}

export interface CollectionNameConfig {
    minLength: number;
    maxLength: number;
}
