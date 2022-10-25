import { FiltersList } from '../models/types';
import { comparisonFilters } from './comparison-filters';
import { elementFilters } from './element-filters';

export const filters: FiltersList = {
    ...comparisonFilters,
    ...elementFilters
};
