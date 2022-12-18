import { Entry } from '..';
import { ArrayFilters, BasicFilters, LogicalFilters, NumberFilters, TextFilters } from './enums';
import { QueryExpression } from './interfaces';

export type SortingField = `${string}:${'-1' | '+1'}`;

export type Query = {
    [key in LogicalFilters]: QueryExpression[];
}

export type LogicalFiltersList = {
    [key in LogicalFilters]: (entry: Entry, filters: FiltersList[]) => boolean;
}

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
