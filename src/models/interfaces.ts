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
    entrySize: number;
    collectionNameMinLength: number;
    collectionNameMaxLength: number;
}

export interface AddOptions {
    unique: string[];
}

export interface ReplaceOptions {
    unique: string[];
}

export interface FindOptions {
    page?: any; // TODO: Add type
    sort?: any[]; // TODO: Add type
}

export interface Query {
    type: string; // TODO: Add enum
    field: string;
    value: any // TODO: Narrow down acceptable value types
}
