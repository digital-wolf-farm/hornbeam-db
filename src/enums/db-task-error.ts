export enum DBTaskError {
    CollectionNameMismatch = 'COLLECTION_NAME_MISMATCH',
    CollectionNotExists = 'COLLECTION_NOT_EXISTS',
    DatabaseNotOpen = 'DATABASE_NOT_OPEN',
    DatabaseSchemaMismatch = 'DATABASE_SCHEMA_MISMATCH',
    DatabaseSizeExceeded = 'DATABASE_SIZE_EXCEEDED',
    DataValidationError = 'DATA_VALIDATION_ERROR',
    FileNotFound = 'FILE_NOT_FOUND',
    FileReadError = 'FILE_READ_ERROR',
    FileSizeExceeded = 'FILE_SIZE_EXCEEDED',
    FileWriteError = 'FILE_WRITE_ERROR',
    FunctionArgumentMismatch = 'FUNCTION_ARGUMENT_MISMATCH',
    FunctionArgumentTypeMismatch = 'FUNCTION_ARGUMENT_TYPE_MISMATCH',
    OptionsSchemaMismatch = 'OPTIONS_OBJECT_MISMATCH'
}
