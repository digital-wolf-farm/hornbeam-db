import { Entry } from '../models/interfaces';
import { utils } from './utils';

describe.only('Utils', () => {
    xdescribe('compareValuesOrder', () => {
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

        it('returns empty list when empty string passed', () => {
            expect(utils.extractIndexes(collection, '')).toEqual([]);
        });

        it('returns empty list when non-existing field is passed as index', () => {
            expect(utils.extractIndexes(collection, 'email')).toEqual([]);
        });

        it('returns list containing existing values when existing field is passed as index', () => {
            expect(utils.extractIndexes(collection, 'login')).toEqual(['lucky-adam', 'lucy111', 'johnTheKing', 'xyz987', 'justMe']);
            expect(utils.extractIndexes(collection, 'membership.cardId')).toEqual([1002, 589, 34]);
        });

        it('returns empty list when passed _id as index', () => {
            expect(utils.extractIndexes(collection, '_id')).toEqual([]);
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
            },
            experience: [
                {
                    company: 'Microsoft',
                    position: 'Junior Dev'
                }, {
                    company: 'Apple',
                    position: 'Mid dev'
                }, {
                    company: 'HP',
                    position: 'Senior dev'
                }
            ]
        };

        it('returns entire Entry when "_" passed as field argument', () => {
            expect(utils.getPropertyByPath(entry, '_')).toEqual(entry);
        });

        it('returns undefined when field argument points to non-existing property', () => {
            expect(utils.getPropertyByPath(entry, 'height')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'hobbies.name')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'hobbies.3')).toEqual(undefined);
            expect(utils.getPropertyByPath(entry, 'address.postalCode')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'company.address.buildingNumber')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'experience.years')).toBe(undefined);
            expect(utils.getPropertyByPath(entry, 'experience.8.company')).toBe(undefined);
        });

        it('returns proper value when field argument points to existing property', () => {
            expect(utils.getPropertyByPath(entry, 'surname')).toBe('Smith');
            expect(utils.getPropertyByPath(entry, 'age')).toBe(49);
            expect(utils.getPropertyByPath(entry, 'pets')).toBe(null);
            expect(utils.getPropertyByPath(entry, 'hobbies')).toEqual(['fishing', 'movies']);
            expect(utils.getPropertyByPath(entry, 'hobbies.1')).toEqual('movies');
            expect(utils.getPropertyByPath(entry, 'address')).toEqual({ street: '5th Avenue', city: 'NY' });
            expect(utils.getPropertyByPath(entry, 'company.address.city')).toBe('NJ');
            expect(utils.getPropertyByPath(entry, 'experience.company')).toEqual(['Microsoft', 'Apple', 'HP']);
            expect(utils.getPropertyByPath(entry, 'experience.2.company')).toBe('HP');
        });
    });
});
