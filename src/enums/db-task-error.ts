export enum DBTaskError {
    DatabaseNotOpen = 'DATABASE_NOT_OPEN',
    DatabaseSchemaMismatch = 'DATABASE_SCHEMA_MISMATCH',
    FileNotFound = 'FILE_NOT_FOUND',
    FileReadError = 'FILE_READ_ERROR',
    FileSizeExceeded = 'FILE_SIZE_EXCEEDED',
    FileWriteError = 'FILE_WRITE_ERROR',
    FunctionArgumentMismatch = 'FUNCTION_ARGUMENT_MISMATCH',
    FunctionArgumentTypeMismatch = 'FUNCTION_ARGUMENT_TYPE_MISMATCH'
};
