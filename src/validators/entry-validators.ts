import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';
import { typesValidators } from './types-validators';

const isEntryValid = (value: unknown): boolean => {
    if (!typesValidators.isObject(value)) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Entry is not an object');
    }

    if (!value['_id']) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Missing _id property');
    }

    if (!typesValidators.isPositiveInteger(value['_id'])) {
        throw new InternalError(DatabaseError.EntryFormatError, '_id is not a positive integer');
    }

    if (Object.keys(value).length < 2) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Entry must contain at least one custom property');
    }

    return true;
};

const isNewEntriesListValid = (entriesData: unknown): boolean => {
    if (!typesValidators.isArray(entriesData)) {
        throw new InternalError(DatabaseError.EntriesListFormatError, 'List of entries is not an array');
    }

    if ((entriesData as unknown[]).length < 1) {
        throw new InternalError(DatabaseError.EntriesListFormatError, 'List of entries is empty');
    }

    (entriesData as unknown[]).every((entry) => entryValidators.isNewEntryValid(entry))

    return true;
};

const isNewEntryValid = (value: unknown): boolean => {
    if (!typesValidators.isObject(value)) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Added entry is not an object');
    }

    if (value['_id']) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Added entry cannot contain _id property');
    }

    if (Object.keys(value).length < 1) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Added entry must contain at least one custom property');
    }

    return true;
};

export const entryValidators = {
    isEntryValid,
    isNewEntriesListValid,
    isNewEntryValid
};
