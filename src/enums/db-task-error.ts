export enum BDTaskError {
    // TODO: Enums Should be in PascalCase
    argsTypeMismatch = 'ARGS_TYPE_MISMATCH',
    arraysNotEqual = 'ARRAYS_NOT_EQUAL',
    collectionFormatMismatch = 'COLLECTION_FORMAT_MISMATCH',
    collectionNameTypeMismatch = 'COLLECTION_NAME_TYPE_MISMATCH',
    collectionNamePatternMismatch = 'COLLECTION_NAME_PATTERN_MISMATCH',
    collectionNotFound = 'COLLECTION_NOT_FOUND',
    databaseFormatMismatch = 'DATABASE_FORMAT_MISMATCH',
    databaseNotOpen = 'DATABASE_NOT_OPEN',
    dataSizeExceeded = 'DATA_SIZE_EXCEEDED',
    directoryCreateError = 'DIRECTORY_CREATE_ERROR',
    entryContainsReservedProperties = 'ENTRY_CONTAINS_RESERVED_PROPERTIES',
    entryFormatMismatch = 'ENTRY_FORMAT_MISMATCH',
    entryNotFound = 'ENTRY_NOT_FOUND',
    entryValueNotUnique = 'ENTRY_VALUE_NOT_UNIQUE',
    entrySizeExceeded = 'ENTRY_SIZE_EXCEEDED',
    fileNotFound = 'FILE_NOT_FOUND',
    fileReadError = 'FILE_READ_ERROR',
    fileWriteError = 'FILE_WRITE_ERROR',
    objectTypeMismatch = 'OBJECT_TYPE_MISMATCH',
    valueNotUnique = 'VALUE_NOT_UNIQUE'
};
