import { Entry } from '..';
import { FiltersList, LogicalFiltersList } from '../models/types';
import { utils } from '../utils/utils';
import { filters } from './filters';

const and = (entry: Entry, queryExpressions: FiltersList[]): boolean => {
    return queryExpressions.every((expression) => {
        const field = Object.keys(expression)[0];
        const filterName = Object.keys(expression[field])[0];
        const referenceValue = expression[field][filterName];

        return filters[filterName](utils.getPropertyByPath(entry, field), referenceValue);
    });
};

const or = (entry: Entry, queryExpressions: FiltersList[]): boolean => {
    return queryExpressions.some((expression) => {
        const field = Object.keys(expression)[0];
        const filterName = Object.keys(expression[field])[0];
        const referenceValue = expression[field][filterName];

        return filters[filterName](utils.getPropertyByPath(entry, field), referenceValue);
    });
};

export const logicalFilters: LogicalFiltersList = {
    and, or
};