export interface Entry {
    [field: string]: any;
}

export interface DBData {
    [collectionName: string]: Entry[];
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

export interface DB {
    insert(collectionName: string, data: object, options?: InsertOptions): number;
    find(collectionName: string, query: Query[], options?: FindOptions): FindResults;
    replace(collectionName: string, query: Query[], data: object, options?: ReplaceOptions): number;
    remove(collectionName: string, query: Query[]): number;
    open(path: string): Promise<void>;
    save(): Promise<void>;
    close(): void;
    stat(): string;
}

export interface DBAPI {
    insert(collectionName: unknown, data: unknown, options?: unknown): number;
    find(collectionName: unknown, query: unknown, options?: unknown): FindResults;
    findById(collectionName: unknown, id: number): Entry;
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
    type: string;
    field: string;
    value: unknown;
}

export interface CollectionNameConfig {
    minLength: number;
    maxLength: number;
}
