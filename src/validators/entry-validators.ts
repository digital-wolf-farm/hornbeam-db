import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';
import { typesValidators } from './types-validators';

const isEntryValid = (value: unknown, isInserted: boolean): boolean => {
    if (!typesValidators.isObject(value)) {
        throw new InternalError(DatabaseError.EntryFormatError, 'Entry is not an object');
    }

    if (isInserted) {
        if ((value as Record<string, unknown>)['_id']) {
            throw new InternalError(DatabaseError.EntryFormatError, 'Inserted entry cannot contain _id property');
        }

        if (Object.keys((value as Record<string, unknown>)).length < 1) {
            throw new InternalError(DatabaseError.EntryFormatError, 'Inserted entry must contain at least one custom property');
        }
    } else {
        if (!(value as Record<string, unknown>)['_id']) {
            throw new InternalError(DatabaseError.EntryFormatError, 'Missing _id property');
        }

        if (!typesValidators.isPositiveInteger((value as Record<string, unknown>)['_id'])) {
            throw new InternalError(DatabaseError.EntryFormatError, 'Property _id is not a positive integer');
        }

        if (Object.keys((value as Record<string, unknown>)).length < 2) {
            throw new InternalError(DatabaseError.EntryFormatError, 'Entry must contain at least one custom property');
        }
    }

    return true;
};

export const entryValidators = {
    isEntryValid
};
