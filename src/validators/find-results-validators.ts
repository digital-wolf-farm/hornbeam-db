import { DatabaseError } from '../models/enums';
import { InternalError } from '../utils/errors';

const isSortingFieldValid = (sortingField: unknown): boolean => {
    if (typeof sortingField !== 'string') {
        throw new InternalError(DatabaseError.SortArgumentsError, 'Sorting field argument is not a string');
    }

    const sortingFieldParams = (sortingField as string).split(':');

    if (sortingFieldParams.length !== 2) {
        throw new InternalError(DatabaseError.SortArgumentsError, 'Sorting field argument does not contain only one ":" character dividing params');
    }

    if (sortingFieldParams[1] !== '+1' && sortingFieldParams[1] !== '-1') {
        throw new InternalError(DatabaseError.SortArgumentsError, 'Sorting field argument does not contain "+1" or "-1" as order parameter');
    }

    return true;
};

export const findResultsValidators = {
    isSortingFieldValid
};
