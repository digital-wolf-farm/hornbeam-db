import { FiltersList } from '../models/types';
import { arrayFilters } from './array-filters';
import { basicFilters } from './basic-filters';
import { numberFilters } from './number-filters';

export const filters: FiltersList = {
    ...basicFilters,
    ...numberFilters,
    ...arrayFilters,
};
