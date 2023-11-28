import { DatabaseError, Filters, LogicalFilters } from '../models/enums';
import { typesValidators } from './types-validators';
import { InternalError } from '../utils/errors';

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

    if (!Array.isArray(query[keys[0]])) {
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

        if (typeof keys[0] !== 'string') {
            throw new InternalError(DatabaseError.FindQueryError, 'Expression field is not a string');
        }

        const condition = expression[keys[0]];

        if (!typesValidators.isObject(condition)) {
            throw new InternalError(DatabaseError.FindQueryError, 'Condition is not an object');
        }

        const conditionFilter = Object.keys(expression[keys[0]]);

        if (conditionFilter.length !== 1) {
            throw new InternalError(DatabaseError.FindQueryError, 'Condition has other number than one filter');
        }

        if (!Object.keys(Filters).map((type) => Filters[type]).includes(conditionFilter[0])) {
            throw new InternalError(DatabaseError.FindQueryError, 'Filter name is not known');
        }

        if (condition[conditionFilter[0]] === Object(condition[conditionFilter[0]])) {
            throw new InternalError(DatabaseError.FindQueryError, 'Reference value is not primitive');
        }
    });

    return true;
}

export const collectionValidators = {
    isQueryValid
};
