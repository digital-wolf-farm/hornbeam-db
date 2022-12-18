export enum DBMethod {
    OpenDB = 'OPEN_DATABASE',
    ReturnDB = 'RETURN_DATABASE',
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
    DataSchemaMismatch = 'DATA_SCHEMA_MISMATCH',
    DataSizeExceeded = 'DATA_SIZE_EXCEEDED',
    DataSizeLimitFormatError = 'DATA_SIZE_LIMIT_FORMAT_ERROR',
    EntryFormatError = 'ENTRY_FORMAT_ERROR',
    EntryIdError = 'ENTRY_ID_ERROR',
    EntriesIdListError = 'ENTRIES_ID_LIST_ERROR',
    EntriesListFormatError = 'ENTRIES_LIST_FORMAT_ERROR',
    FieldValueNotUnique = 'FIELD_VALUE_NOT_UNIQUE',
    FindQueryError = 'FIND_QUERY_ERROR',
    LimitArgumentsError = 'LIMIT_ARGUMENTS_ERROR',
    SortArgumentsError = 'SORT_ARGUMENTS_ERROR'
}

export enum LogicalFilters {
    And = 'and',
    Or = 'or'
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
    Part = 'part',
    Size = 'size'
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
