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
    Equal = 'eq',
    Equali = 'eqi',
    NotEqual = 'neq',
    NotEquali = 'neqi',
    Greater = 'gt',
    GreaterOrEqual = 'gte',
    LessThan = 'lt',
    LessThanOrEqual = 'lte',
    Exist = 'exist'
}
