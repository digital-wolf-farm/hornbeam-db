import { AddOptions, Query } from '../models/interfaces';

// Guards for JS data types
function isArray(value: unknown): value is [] {
    return Array.isArray(value);
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

    if (keys.length === 0) {
        return false;
    }

    let validProperties = true;

    keys.forEach((key) => {
        if (['unique'].findIndex((item) => item === key) === -1) {
            validProperties = false;
        }
    });

    return validProperties;
}

function isReplaceOptionsObject(value: unknown): value is AddOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length === 0) {
        return false;
    }

    let validProperties = true;

    keys.forEach((key) => {
        if (['unique'].findIndex((item) => item === key) === -1) {
            validProperties = false;
        }
    });

    return validProperties;
}

function isFindOptionsObject(value: unknown): value is AddOptions {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length === 0) {
        return false;
    }

    let validProperties = true;

    keys.forEach((key) => {
        if (['page', 'sort'].findIndex((item) => item === key) === -1) {
            validProperties = false;
        }
    });

    return validProperties;
}

function isQueryArray(value: unknown): value is Query[] {
    if (!isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return true;
    }

    let validItems = true;

    value.forEach((item) => {
        if (!isQueryObject(item)) {
            validItems = false;
        }
    });

    return validItems;
}

function isQueryObject(value: unknown): value is Query {
    if (!isObject(value)) {
        return false;
    }

    const keys = Object.keys(value);

    if (keys.length !== 3) {
        return false;
    }

    let validProperties = true;

    ['type', 'field', 'value'].forEach((item) => {
        if (keys.findIndex((key) => item === key) === -1) {
            validProperties = false;
        }
    });

    return validProperties;
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
