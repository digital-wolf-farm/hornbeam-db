import { CollectionOptions } from '../models/interfaces';
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

export const collectionValidators = {
    isCollectionNameValid,
    isCollectionOptionsValid
};
