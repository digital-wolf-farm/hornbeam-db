export enum DBMethod {
    OpenDB = 'OPEN_DATABASE',
    SaveDB = 'SAVE_DATABASE',
    StatDB = 'STAT_DATABASE',
    AddEntry = 'ADD_ENTRY',
    FindEntries = 'FIND_ENTRIES',
    ReplaceEntry = 'REPLACE_ENTRY',
    RemoveEntry = 'REMOVE_ENTRY'
}

export enum DBTaskError {
    CollectionNameMismatch = 'COLLECTION_NAME_MISMATCH',
    CollectionNotExists = 'COLLECTION_NOT_EXISTS',
    DatabaseNotOpen = 'DATABASE_NOT_OPEN',
    DatabaseSchemaMismatch = 'DATABASE_SCHEMA_MISMATCH',
    DatabaseSizeExceeded = 'DATABASE_SIZE_EXCEEDED',
    FieldNotFound = 'FIELD_NOT_FOUND',
    FieldValueNotUnique = 'FIELD_VALUE_NOT_UNIQUE',
    FileNotFound = 'FILE_NOT_FOUND',
    FileReadError = 'FILE_READ_ERROR',
    FileWriteError = 'FILE_WRITE_ERROR',
    FunctionArgumentMismatch = 'FUNCTION_ARGUMENT_MISMATCH',
    SortDataTypeError = 'SORT_DATA_TYPE_ERROR'
}

export enum FilterType {
    // Contains = 'contains',
    Eq = 'eq',
    Eqi = 'eqi',
    Greater = 'gt',
    GreaterOrEqual = 'gte',
    Less = 'lt',
    LessOrEqual = 'lte',
    NotEqual = 'ne',
    // InArray = 'in',
    // NotInArray = 'nin'
}
