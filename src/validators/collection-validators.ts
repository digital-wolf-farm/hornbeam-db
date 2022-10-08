import { FilterType } from '../models/enums';
import { CollectionOptions, Entry, Query } from '../models/interfaces';
import { basicTypesValidators } from './basic-types-validators';
import { entryValidators } from './entry-validators';

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

const isEntriesListValid = (entriesData: Entry[]): boolean => {
    if (!basicTypesValidators.isArray(entriesData)) {
        return false;
    }

    if (entriesData.length < 1) {
        return false;
    }

    if (!entriesData.every((entry) => entryValidators.isNewEntryValid(entry))) {
        return false;
    }

    return true;
};

const isIdsListValid = (entriesId: number[]): boolean => {
    if (!basicTypesValidators.isArray(entriesId)) {
        return false;
    }

    if (entriesId.length < 1) {
        return false;
    }

    if (!entriesId.every((entryId) => basicTypesValidators.isPositiveInteger(entryId))) {
        return false;
    }

    return true;
};

const isQueryValid = (query: Query): boolean => {
    if (!basicTypesValidators.isObject(query)) {
        return false;
    }

    const keys = Object.keys(query);

    if (keys.length !== 1) {
        return false;
    }

    // TODO: Add validator to (nested) field name
    if (!basicTypesValidators.isString(keys[0])) {
        return false;
    }

    const condition = query[keys[0]];

    if (!basicTypesValidators.isObject(condition)) {
        return false;
    }

    const conditionKeys = Object.keys(query[keys[0]]);

    if (conditionKeys.length !== 1) {
        return false;
    }

    if (!Object.keys(FilterType).map((type) => FilterType[type]).includes(conditionKeys[0])) {
        return false;
    }

    if (condition[conditionKeys[0]] === Object(condition[conditionKeys[0]])) {
        return false;
    }

    return true;
}

export const collectionValidators = {
    isCollectionNameValid,
    isCollectionOptionsValid,
    isEntriesListValid,
    isIdsListValid,
    isQueryValid
};
