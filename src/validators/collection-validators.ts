import { DatabaseError, Filters } from '../models/enums';
import { CollectionOptions, NewEntry, Query } from '../models/interfaces';
import { typesValidators } from './types-validators';
import { entryValidators } from './entry-validators';
import { InternalError } from '../utils/errors';

const isCollectionNameValid = (name: string): boolean => {
    if (!(new RegExp(`^([a-z][a-z0-9-_]{2,31})$`, 'g').test(name))) {
        throw new InternalError(DatabaseError.CollectionNameError, 'Collection name does not meet the pattern');
    }

    return true;
};

const isCollectionOptionsValid = (options: CollectionOptions): boolean => {
    if (!typesValidators.isObject(options)) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Options are not an object');
    }

    if (Object.keys(options).length === 0) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Options are empty object');
    }

    // [].include(key) is better?
    if (!Object.keys(options).every((key) => ['indexes'].findIndex((item) => item === key) !== -1)) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Options object contains unknown property');
    }

    if (!typesValidators.isArray(options['indexes'])) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Indexes list is not an array');
    }

    if (!options['indexes'].every((index) => typeof index === 'string')) {
        throw new InternalError(DatabaseError.CollectionOptionsError, 'Index(es) is/are not a string');
    }

    return true;
};

const isEntriesListValid = (entriesData: NewEntry[]): boolean => {
    if (!typesValidators.isArray(entriesData)) {
        throw new InternalError(DatabaseError.EntriesListFormatError, 'List of entries is not an array');
    }

    if (entriesData.length < 1) {
        throw new InternalError(DatabaseError.EntriesListFormatError, 'List of entries is empty');
    }

    entriesData.every((entry) => entryValidators.isNewEntryValid(entry))

    return true;
};


const isIdsListValid = (entriesId: number[]): boolean => {
    if (!typesValidators.isArray(entriesId)) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'List of ids is not an array');
    }

    if (entriesId.length < 1) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'List of ids is empty');
    }

    if (!entriesId.every((entryId) => typesValidators.isPositiveInteger(entryId))) {
        throw new InternalError(DatabaseError.EntriesIdListError, 'At least one id is not a positive integer');
    }

    return true;
};

const isQueryValid = (query: Query): boolean => {
    if (!typesValidators.isObject(query)) {
        throw new InternalError(DatabaseError.FindQueryError, 'Query is not an object');
    }

    const keys = Object.keys(query);

    if (keys.length !== 1) {
        throw new InternalError(DatabaseError.FindQueryError, 'Query has more than one property');
    }

    // TODO: Add validator to (nested) field name
    if (!typesValidators.isString(keys[0])) {
        throw new InternalError(DatabaseError.FindQueryError, 'Field is not a string');
    }

    const condition = query[keys[0]];

    if (!typesValidators.isObject(condition)) {
        throw new InternalError(DatabaseError.FindQueryError, 'Condition is not an object');
    }

    const conditionKeys = Object.keys(query[keys[0]]);

    if (conditionKeys.length !== 1) {
        throw new InternalError(DatabaseError.FindQueryError, 'Condition has more than one property');
    }

    if (!Object.keys(Filters).map((type) => Filters[type]).includes(conditionKeys[0])) {
        throw new InternalError(DatabaseError.FindQueryError, 'Filter name is not known');
    }

    if (condition[conditionKeys[0]] === Object(condition[conditionKeys[0]])) {
        throw new InternalError(DatabaseError.FindQueryError, 'Value of condition is not primitive');
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
