import { FilterType } from './enums';

export type FiltersList = {
    [key in FilterType]: (entryValue: unknown, reference: unknown) => boolean;
}
