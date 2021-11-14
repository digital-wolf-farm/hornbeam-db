import { typeGuards } from '../../../src/lib/type-guards';

describe.only('Type Guards', () => {
    describe('isArray', () => {
        it('should return true when array is passed', () => {
            expect(typeGuards.isArray([])).toBe(true);
            expect(typeGuards.isArray([1, 2, 3])).toBe(true);
            expect(typeGuards.isArray(['a', 'b', 'c'])).toBe(true);
            expect(typeGuards.isArray([[], []])).toBe(true);
            expect(typeGuards.isArray([{}, {}])).toBe(true);
            expect(typeGuards.isArray([null, null])).toBe(true);
        });

        it('should return false when non array is passed', () => {
            expect(typeGuards.isArray(123)).toBe(false);
            expect(typeGuards.isArray('abc')).toBe(false);
            expect(typeGuards.isArray(undefined)).toBe(false);
            expect(typeGuards.isArray(null)).toBe(false);
            expect(typeGuards.isArray({})).toBe(false);
            expect(typeGuards.isArray(() => { })).toBe(false);
            expect(typeGuards.isArray(new Date())).toBe(false);
        });
    });

    describe('isObject', () => {
        it('should return true when object is passed', () => {
            expect(typeGuards.isObject({})).toBe(true);
        });

        it('should return false when non object is passed', () => {
            expect(typeGuards.isObject(123)).toBe(false);
            expect(typeGuards.isObject('abc')).toBe(false);
            expect(typeGuards.isObject(() => { })).toBe(false);
            expect(typeGuards.isObject([])).toBe(false);
            expect(typeGuards.isObject(null)).toBe(false);
            expect(typeGuards.isObject(String(123))).toBe(false);
            expect(typeGuards.isObject(Number('123'))).toBe(false);
            expect(typeGuards.isObject(Date())).toBe(false);
            expect(typeGuards.isObject(Date.now())).toBe(false);
        });
    });

    describe('isString', () => {
        it('should return true when string is passed', () => {
            expect(typeGuards.isString('abc')).toBe(true);
            expect(typeGuards.isString(String(123))).toBe(true);
            expect(typeGuards.isString(Date())).toBe(true);
        });

        it('should return false when non object is passed', () => {
            expect(typeGuards.isString(new String(123))).toBe(false);
            expect(typeGuards.isString(123)).toBe(false);
            expect(typeGuards.isString(Date.now())).toBe(false);
            expect(typeGuards.isString(null)).toBe(false);
            expect(typeGuards.isString(undefined)).toBe(false);
        });
    });

    describe('isAddOptionsObject', () => {
        it('should return true when valid object is passed', () => {
            expect(typeGuards.isAddOptionsObject({ unique: [] })).toBe(true);
        });

        it('should return false when invalid value is passed', () => {
            expect(typeGuards.isAddOptionsObject(undefined)).toBe(false);
            expect(typeGuards.isAddOptionsObject('abc')).toBe(false);
            expect(typeGuards.isAddOptionsObject(123)).toBe(false);
            expect(typeGuards.isAddOptionsObject({})).toBe(false);
            expect(typeGuards.isAddOptionsObject([])).toBe(false);
            expect(typeGuards.isAddOptionsObject(() => { })).toBe(false);
            expect(typeGuards.isAddOptionsObject({ someProperty: 'someValue' })).toBe(false);
            expect(typeGuards.isAddOptionsObject({ unique: [], someProperty: 'someValue' })).toBe(false);
        });
    });

    describe('isReplaceOptionsObject', () => {
        it('should return true when valid object is passed', () => {
            expect(typeGuards.isReplaceOptionsObject({ unique: [] })).toBe(true);
        });

        it('should return false when invalid value is passed', () => {
            expect(typeGuards.isReplaceOptionsObject(undefined)).toBe(false);
            expect(typeGuards.isReplaceOptionsObject('abc')).toBe(false);
            expect(typeGuards.isReplaceOptionsObject(123)).toBe(false);
            expect(typeGuards.isReplaceOptionsObject({})).toBe(false);
            expect(typeGuards.isReplaceOptionsObject([])).toBe(false);
            expect(typeGuards.isReplaceOptionsObject(() => { })).toBe(false);
            expect(typeGuards.isReplaceOptionsObject({ someProperty: 'someValue' })).toBe(false);
            expect(typeGuards.isReplaceOptionsObject({ unique: [], someProperty: 'someValue' })).toBe(false);
        });
    });

    describe('isFindOptionsObject', () => {
        it('should return true when valid object is passed', () => {
            expect(typeGuards.isFindOptionsObject({ sort: {} })).toBe(true);
            expect(typeGuards.isFindOptionsObject({ page: {} })).toBe(true);
            expect(typeGuards.isFindOptionsObject({ sort: {}, page: {} })).toBe(true);
        });

        it('should return false when invalid value is passed', () => {
            expect(typeGuards.isFindOptionsObject(undefined)).toBe(false);
            expect(typeGuards.isFindOptionsObject('abc')).toBe(false);
            expect(typeGuards.isFindOptionsObject(123)).toBe(false);
            expect(typeGuards.isFindOptionsObject({})).toBe(false);
            expect(typeGuards.isFindOptionsObject([])).toBe(false);
            expect(typeGuards.isFindOptionsObject(() => { })).toBe(false);
            expect(typeGuards.isFindOptionsObject({ someProperty: 'someValue' })).toBe(false);
            expect(typeGuards.isFindOptionsObject({ sort: {}, someProperty: 'someValue' })).toBe(false);
            expect(typeGuards.isFindOptionsObject({ sort: {}, page: {}, someProperty: 'someValue' })).toBe(false);
        });
    });

    describe('isQueryArray', () => {
        it('should return true when valid array is passed', () => {
            expect(typeGuards.isQueryArray([])).toBe(true);
            expect(typeGuards.isQueryArray([{ type: '', field: '', value: '' }])).toBe(true);
            expect(typeGuards.isQueryArray([{ type: '', field: '', value: '' }, { type: '', field: '', value: '' }])).toBe(true);
        });

        it('should return false when invalid value is passed', () => {
            expect(typeGuards.isQueryArray(undefined)).toBe(false);
            expect(typeGuards.isQueryArray('abc')).toBe(false);
            expect(typeGuards.isQueryArray(123)).toBe(false);
            expect(typeGuards.isQueryArray({})).toBe(false);
            expect(typeGuards.isQueryArray(() => { })).toBe(false);
            expect(typeGuards.isQueryArray([{}])).toBe(false);
            expect(typeGuards.isQueryArray([{ type: '', field: '' }])).toBe(false);
            expect(typeGuards.isQueryArray([{ type: '', value: '' }])).toBe(false);
            expect(typeGuards.isQueryArray([{ field: '', value: '' }])).toBe(false);
            expect(typeGuards.isQueryArray([{ type: '', field: '', value: '' }, {}])).toBe(false);
        });
    });
});