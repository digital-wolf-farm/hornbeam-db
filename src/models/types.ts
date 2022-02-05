import { FilterType } from './enums';

export type FiltersList = {
    [key in FilterType]: Function;
}
