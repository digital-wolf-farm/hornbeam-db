import { DatabaseError } from '../models/enums';
import { Entry, FindMethods, FindResults, LimitMethods, SortMethods } from '../models/interfaces';
import { SortingField } from '../models/types';
import { InternalError } from '../utils/errors';
import { utils } from '../utils/utils';
import { findResultsValidators } from '../validators/find-results-validators';
import { typesValidators } from '../validators/types-validators';

export const findResults = (foundEntries: Entry[]): FindMethods => {

    let result: Entry[] = JSON.parse(JSON.stringify(foundEntries));
    let skippedEntriesNumber: number;
    let returnedEntriesSize: number;

    const results = (): FindResults => {
        return {
            data: result,
            ...(skippedEntriesNumber && returnedEntriesSize) && {
                info: {
                    total: foundEntries.length,
                    size: returnedEntriesSize,
                    skipped: skippedEntriesNumber
                }
            }
        };
    };

    const sort = (sortingField: SortingField, languageCode?: string): SortMethods => {
        findResultsValidators.isSortingFieldValid(sortingField);

        if (languageCode && !typesValidators.isString(languageCode)) {
            throw new InternalError(DatabaseError.SortArgumentsError, 'Language code argument is not a string');
        }

        const field = sortingField.split(':')[0];
        const order = sortingField.split(':')[1];

        result.sort((a, b) => utils.compareValuesOrder(a, b, field, order, languageCode));

        return {
            results,
            limit
        };
    };

    const limit = (resultsSize: number, skippedEntries: number): LimitMethods => {
        if (!typesValidators.isPositiveInteger(resultsSize)) {
            throw new InternalError(DatabaseError.LimitArgumentsError, 'Results size argument is not a positive integer');
        }

        if (!typesValidators.isNonNegativeInteger(skippedEntries)) {
            throw new InternalError(DatabaseError.LimitArgumentsError, 'Skipped entries argument is neither zero nor a positive integer');
        }

        result = result.slice(skippedEntries, skippedEntries + resultsSize);

        skippedEntriesNumber = skippedEntries;
        returnedEntriesSize = resultsSize;

        return {
            results
        };
    };

    return {
        results,
        sort,
        limit
    };
};
