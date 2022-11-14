import { Entry } from '../models/interfaces';
import { utils } from './utils';

describe('Utils', () => {
    describe('compareValuesOrder', () => {
        const Adam: Entry = {
            _id: 1,
            name: 'Adam',
            age: 49,
            drivingLicence: true,
            pets: null,
            hobbies: ['fishing', 'movies'],
            company: {
                name: 'Super Street Tyres Inc.',
                address: {
                    street: 'One Way Street',
                    city: 'NJ'
                }
            }
        };

        const Zoey: Entry = {
            _id: 1,
            name: 'Zoey',
            age: 19,
            drivingLicence: false,
            pets: null,
            hobbies: ['music', 'fashion'],
            company: {
                name: 'AAA Best Lipsticks',
                address: {
                    street: 'Industrial Street',
                    city: 'LA'
                }
            }
        };

        it('returns -1 when value of Entry A should be before value of Entry B when the same data type and ascending order required', () => {
            expect([Adam, Zoey].sort((a, b) => utils.compareValuesOrder(a, b, 'name', '+1', 'en'))).toEqual([Adam, Zoey]);
            expect([Adam, Zoey].sort((a, b) => utils.compareValuesOrder(a, b, 'age', '+1', 'en'))).toEqual([Zoey, Adam]);
            expect([Adam, Zoey].sort((a, b) => utils.compareValuesOrder(a, b, 'drivingLicence', '+1', 'en'))).toEqual([Adam, Zoey]);
        });
    });

    describe('extractIndexes', () => {
        const collection: Entry[] = [
            { _id: 1, login: 'lucky-adam', membership: { cardId: 1002 } },
            { _id: 2, login: 'lucy111', membership: { cardId: 589 } },
            { _id: 3, login: 'johnTheKing', },
            { _id: 4, login: 'xyz987', membership: { cardId: 34 } },
            { _id: 5, login: 'justMe', membership: null },
        ];

        it('returns empty object when empty array of indexes passed', () => {
            expect(utils.extractIndexes(collection, [])).toEqual({});
        });

        it('returns empty object when non-existing field is passed as index', () => {
            expect(utils.extractIndexes(collection, ['email'])).toEqual({});
        });

        it('returns object with array(s) filled with existing values when existing field(s) is/are passed as index(es)', () => {
            expect(utils.extractIndexes(collection, ['login'])).toEqual({ login: ['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe'] });
            expect(utils.extractIndexes(collection, ['membership.cardId'])).toEqual({ 'membership.cardId': [1002, 589, 34] });
            expect(utils.extractIndexes(collection, ['membership.cardId', 'login'])).toEqual({
                'membership.cardId': [1002, 589, 34],
                login: ['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe']
            });
        });

        it('returns object only with existing indexes', () => {
            expect(utils.extractIndexes(collection, ['email', 'login', 'ssn'])).toEqual({ login: ['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe'] });
        });

        it('returns object without duplicated indexes when duplicated fields are paased as indexes', () => {
            expect(utils.extractIndexes(collection, ['email', 'email'])).toEqual({});
            expect(utils.extractIndexes(collection, ['login', 'login'])).toEqual({ login: ['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe'] });
        });

        it('returns object without _id index', () => {
            expect(utils.extractIndexes(collection, ['_id', 'login'])).toEqual({ login: ['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe'] });
        });
    });

    describe('getPropertyByPath', () => {
        const entry: Entry = {
            _id: 1,
            name: 'Adam',
            surname: 'Smith',
            age: 49,
            drivingLicence: true,
            pets: null,
            hobbies: ['fishing', 'movies'],
            address: {
                street: '5th Avenue',
                city: 'NY'
            },
            company: {
                name: 'Super Street Tyres Inc.',
                address: {
                    street: 'One Way Street',
                    city: 'NJ'
                }
            }
        };

        it('returns entire Entry when "_" passed as field argument', () => {
            expect(utils.getPropertyByPath(entry, '_')).toEqual(entry);
        });

        it('returns undefined when field argument points to non-existing property', () => {
            expect(utils.getPropertyByPath(entry, 'height')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'hobbies.name')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'address.postalCode')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'company.address.buildingNumber')).toBe(undefined);
        });

        it('returns Entry property when field argument points to existing property', () => {
            expect(utils.getPropertyByPath(entry, 'surname')).toBe('Smith');
            expect(utils.getPropertyByPath(entry, 'age')).toBe(49);
            expect(utils.getPropertyByPath(entry, 'pets')).toBe(null);
            expect(utils.getPropertyByPath(entry, 'hobbies')).toEqual(['fishing', 'movies']);
            expect(utils.getPropertyByPath(entry, 'address')).toEqual({ street: '5th Avenue', city: 'NY' });
            expect(utils.getPropertyByPath(entry, 'company.address.city')).toBe('NJ');
        });
    });
});
