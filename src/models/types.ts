import { ArrayFilters, BasicFilters, NumberFilters, TextFilters } from './enums';

export type BasicFiltersList = {
    [key in BasicFilters]: (entryValue: unknown, reference: unknown) => boolean;
}

export type NumberFiltersList = {
    [key in NumberFilters]: (entryValue: unknown, reference: unknown) => boolean;
}

export type ArrayFiltersList = {
    [key in ArrayFilters]: (entryValue: unknown, reference: unknown) => boolean;
}

export type TextFiltersList = {
    [key in TextFilters]: (entryValue: unknown, reference: unknown) => boolean;
}

export type FiltersList = {
    [key in BasicFilters | NumberFilters | ArrayFilters | TextFilters]: (entryValue: unknown, reference: unknown) => boolean;
}
