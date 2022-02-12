import { FilterType } from './enums';

export type FiltersList = {
    [key in FilterType]: (item: unknown, value: unknown) => boolean;
}
