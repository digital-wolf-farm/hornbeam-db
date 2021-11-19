import { AddOptions, FindOptions, PaginationOptions, Query, SortingOptions } from '../models/interfaces';

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

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

// Guard for custom data types

function isAddOptionsObject(value: unknown): value is AddOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length !== 1 || !value['unique']) {
        return false;
    }

    if (!isArray(value['unique']) || value['unique'].length === 0 || !value['unique'].every((element) => isString(element))) {
        return false;
    }

    return true;
}

function isReplaceOptionsObject(value: unknown): value is AddOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length !== 1 || !value['unique']) {
        return false;
    }

    if (!isArray(value['unique']) || value['unique'].length === 0 || !value['unique'].every((element) => isString(element))) {
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

    if (!isNumber(value['pageNumber']) || !isNumber(value['pageSize'])) {
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

    // TODO: Add validation for value of value field
    if (!isString(value['type']) || !isString(value['field'])) {
        return false;
    }

    return true;
}

export const typeGuards = {
    isArray,
    isObject,
    isString,
    isAddOptionsObject,
    isReplaceOptionsObject,
    isFindOptionsObject,
    isQueryArray
};
