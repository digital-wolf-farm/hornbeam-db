import { Entry } from '../models/interfaces';

const getPropertyByPath = (object: Entry, field: string): unknown => {
    return field.split('.').reduce((obj, prop) => {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return undefined;
        } else {
            return obj[prop];
        }
    }, object as any);
}

export {
    getPropertyByPath
};
