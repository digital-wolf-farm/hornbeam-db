export enum DBMethod {
    OpenDB = 'OPEN_DATABASE',
    SaveDB = 'SAVE_DATABASE',
    StatDB = 'STAT_DATABASE',
    GetCollection = 'GET_COLLECTION',
    InsertEntry = 'INSERT_ENTRY',
    InsertEntries = 'INSERT_ENTRIES',
    FindEntry = 'FIND_ENTRY',
    FindEntries = 'FIND_ENTRIES',
    ReplaceEntry = 'REPLACE_ENTRY',
    RemoveEntry = 'REMOVE_ENTRY',
    RemoveEntries = 'REMOVE_ENTRIES'
}

export enum DatabaseError {
    CollectionNameError = 'COLLECTION_NAME_ERROR',
    CollectionOptionsError = 'COLLECTION_OPTIONS_ERROR',
    DatabaseSchemaMismatch = 'DATABASE_SCHEMA_MISMATCH',
    DatabaseSizeExceeded = 'DATABASE_SIZE_EXCEEDED',
    EntryFormatError = 'ENTRY_FORMAT_ERROR',
    EntryIdError = 'ENTRY_ID_ERROR',
    FieldValueNotUnique = 'FIELD_VALUE_NOT_UNIQUE',
    FileNotFound = 'FILE_NOT_FOUND',
    FilePathError = 'FILE_PATH_ERROR',
    FileReadError = 'FILE_READ_ERROR',
    FileWriteError = 'FILE_WRITE_ERROR',
    FindQueryError = 'FIND_QUERY_ERROR'
}

export enum BasicFilters {
    Exist = 'exist',
    Equal = 'eq',
    EqualI = 'eqi',
    NotEqual = 'neq',
    NotEqualI = 'neqi'
}

export enum NumberFilters {
    Greater = 'gt',
    GreaterOrEqual = 'gte',
    LessThan = 'lt',
    LessThanOrEqual = 'lte',
}

export enum ArrayFilters {
    All = 'all',
    Size = 'size',
    Contain = 'contain'
}

export enum TextFilters {
    Text = 'text',
}

export const Filters = {
    ...BasicFilters,
    ...NumberFilters,
    ...ArrayFilters,
    ...TextFilters
};
