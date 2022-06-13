import { FilterType } from '../models/enums';
import { FindOptions, PaginationOptions, Query, SortingOptions, NewEntry, Entry } from '../models/interfaces';

// Guards for JS data types

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

function isObject(value: unknown): value is object {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isPositiveInteger(value: unknown): value is number {
    return (Number.isInteger(value) && value > 0);
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

// Guard for custom data types

function isNewEntry(value: unknown): value is NewEntry {
    if (!isObject(value)) {
        return false;
    }

    if (value['_id']) {
        return false;
    }

    return true;
}

function isEntry(value: unknown): value is Entry {
    if (!isObject(value)) {
        return false;
    }

    if (!value['_id']) {
        return false;
    }

    return true;
}

function isUniqueFieldsArray(value: unknown): value is string[] {
    if (!isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return false;
    }

    if (value.findIndex((field) => field === '_id') !== -1 || !value.every((element) => isString(element))) {
        return false;
    }

    return true;
}

function isPaginationOptionsValid(value: unknown): value is PaginationOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if(!keys.every((key) => ['pageNumber', 'pageSize'].findIndex((item) => item === key) !== -1)) {
        return false;
    }

    if (!isPositiveInteger(value['pageNumber']) || !isPositiveInteger(value['pageSize'])) {
        return false;
    }

    return true;
}

function isSortingOptionsValid(value: unknown): value is SortingOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if(!keys.every((key) => ['field', 'order'].findIndex((item) => item === key) !== -1)) {
        return false;
    }

    if (!isString(value['field']) || (value['order'] !== 1 && value['order'] !== -1)) {
        return false;
    }

    return true;
}

function isFindOptionsObject(value: unknown): value is FindOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length === 0 || keys.length > 2) {
        return false;
    }

    if(!keys.every((key) => ['page', 'sort'].findIndex((item) => item === key) !== -1)) {
        return false;
    }

    if (value['page'] && !isPaginationOptionsValid(value['page'])) {
        return false;
    }

    if (value['sort'] && (!isArray(value['sort']) || value['sort'].length === 0 || !value['sort'].every((element) => isSortingOptionsValid(element)))) {
        return false;
    }

    return true;
}

function isQueryArray(value: unknown): value is Query[] {
    if (!isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return true;
    }

    if (!value.every((element) => isQueryObjectValid(element))) {
        return false;
    }

    return true;
}

function isQueryObjectValid(value: unknown): value is Query {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length !== 3) {
        return false;
    }

    if(!keys.every((key) => ['type', 'field', 'value'].findIndex((item) => item === key) !== -1)) {
        return false;
    }

    if (!isString(value['type']) || !Object.keys(FilterType).map((type) => FilterType[type]).includes(value['type'])) {
        return false;
    }

    if (!isString(value['field'])) {
        return false;
    }

    if (value['value'] === Object(value['value'])) {
        return false;
    }

    return true;
}

export const typeGuards = {
    isArray,
    isNumber,
    isObject,
    isPositiveInteger,
    isString,
    isNewEntry,
    isEntry,
    isUniqueFieldsArray,
    isFindOptionsObject,
    isQueryArray
};
