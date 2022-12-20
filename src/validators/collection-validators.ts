import { DatabaseError, Filters, LogicalFilters } from '../models/enums';
import { typesValidators } from './types-validators';
import { InternalError } from '../utils/errors';

const isCollectionIndexesListValid = (indexes: unknown): boolean => {
    if (!typesValidators.isArray(indexes)) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Indexes argument is not an array');
    }

    if ((indexes as unknown[]).length === 0) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'List of indexes is empty');
    }

    if (!(indexes as unknown[]).every((field) => typeof field === 'string')) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'At least one of provided indexes is not a string');
    }

    return true;
};

const isIdsListValid = (entriesId: unknown): boolean => {
    if (!typesValidators.isArray(entriesId)) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'List of ids is not an array');
    }

    if ((entriesId as unknown[]).length === 0) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'List of ids is empty');
    }

    if (!(entriesId as unknown[]).every((entryId) => typesValidators.isPositiveInteger(entryId))) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'At least one id is not a positive integer');
    }

    return true;
};

const isQueryValid = (query: unknown): boolean => {
    if (!typesValidators.isObject(query)) {
        throw new InternalError(DatabaseError.FindQueryError, 'Query is not an object');
    }

    const keys = Object.keys(query);

    if (keys.length !== 1) {
        throw new InternalError(DatabaseError.FindQueryError, 'Query contains other number than one logical operator');
    }

    if (!(Object.values(LogicalFilters) as unknown[]).includes(keys[0])) {
        throw new InternalError(DatabaseError.FindQueryError, 'Query contains invalid logical operators');
    }

    if (!typesValidators.isArray(query[keys[0]])) {
        throw new InternalError(DatabaseError.FindQueryError, 'Expressions list is not an array');
    }

    if ((query[keys[0]] as unknown[]).length === 0) {
        throw new InternalError(DatabaseError.FindQueryError, 'Expressions list is empty');
    }

    (query[keys[0]] as unknown[]).forEach((expression) => {
        if (!typesValidators.isObject(expression)) {
            throw new InternalError(DatabaseError.FindQueryError, 'At least one expression is not an object');
        }

        const keys = Object.keys(expression);

        if (keys.length !== 1) {
            throw new InternalError(DatabaseError.FindQueryError, 'Expression has other number than one field');
        }

        if (!typesValidators.isString(keys[0])) {
            throw new InternalError(DatabaseError.FindQueryError, 'Expression field is not a string');
        }

        const condition = expression[keys[0]];

        if (!typesValidators.isObject(condition)) {
            throw new InternalError(DatabaseError.FindQueryError, 'Condition is not an object');
        }

        const conditionKeys = Object.keys(expression[keys[0]]);

        if (conditionKeys.length !== 1) {
            throw new InternalError(DatabaseError.FindQueryError, 'Condition has other number than one field');
        }

        if (!Object.keys(Filters).map((type) => Filters[type]).includes(conditionKeys[0])) {
            throw new InternalError(DatabaseError.FindQueryError, 'Filter name is not known');
        }

        if (condition[conditionKeys[0]] === Object(condition[conditionKeys[0]])) {
            throw new InternalError(DatabaseError.FindQueryError, 'Value of condition is not primitive');
        }
    });

    return true;
}

export const collectionValidators = {
    isCollectionIndexesListValid,
    isIdsListValid,
    isQueryValid
};
