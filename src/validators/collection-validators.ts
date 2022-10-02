import { CollectionOptions, Query } from '../models/interfaces';
import { basicTypesValidators } from './basic-types-validators';

const isCollectionNameValid = (name: string): boolean => {
    return new RegExp(`^([a-z][a-z0-9-_]{2,31})$`, 'g').test(name);
};

const isCollectionOptionsValid = (options: CollectionOptions): boolean => {
    if (!basicTypesValidators.isObject(options)) {
        return false;
    }

    if (Object.keys(options).length === 0) {
        return false;
    }

    // [].include(key) is better?
    if (!Object.keys(options).every((key) => ['indexes'].findIndex((item) => item === key) !== -1)) {
        return false;
    }

    if (!basicTypesValidators.isArray(options['indexes'])) {
        return false;
    }

    if (!options['indexes'].every((index) => typeof index === 'string')) {
        return false;
    }

    return true;
}

const isQueryArrayValid = (value: Query[]): boolean => {
    if (!basicTypesValidators.isArray(value)) {
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

const isQueryObjectValid = (value: Query): boolean => {
    if (!basicTypesValidators.isObject(value)) {
        return false;
    }

    // const keys = Object.keys(value);

    // if (keys.length !== 3) {
    //     return false;
    // }

    // if(!keys.every((key) => ['type', 'field', 'value'].findIndex((item) => item === key) !== -1)) {
    //     return false;
    // }

    // if (!basicTypesValidators.isString(value['type']) || !Object.keys(FilterType).map((type) => FilterType[type]).includes(value['type'])) {
    //     return false;
    // }

    // if (!basicTypesValidators.isString(value['field'])) {
    //     return false;
    // }

    // if (value['value'] === Object(value['value'])) {
    //     return false;
    // }

    return true;
}

export const collectionValidators = {
    isCollectionNameValid,
    isCollectionOptionsValid,
    isQueryArrayValid
};
