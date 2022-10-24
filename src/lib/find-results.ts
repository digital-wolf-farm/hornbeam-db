import { Entry, FindMethods, FindResults, LimitMethods, SortingField, SortMethods } from '../models/interfaces';
import { utils } from '../utils/utils';

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

    const sort = (param: SortingField, languageCode: string): SortMethods => {
        // TODO: Add argument verifier

        const field = param.split(':')[0];
        const order = param.split(':')[1];

        result.sort((a, b) => utils.compareValuesOrder(a, b, field, order, languageCode));

        return {
            results,
            limit
        };
    };

    const limit = (resultsSize: number, skippedEntries: number): LimitMethods => {
        // TODO: Add arguments verifiers and interface

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
