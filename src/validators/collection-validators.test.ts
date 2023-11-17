import { DatabaseError } from '../models/enums';
import { collectionValidators } from './collection-validators';

describe('CollectionValidators', () => {
    describe('isQueryValid', () => {
        it('throws error when query is not an object', () => {
            try {
                collectionValidators.isQueryValid([{ name: { eq: 'John' } }]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Query is not an object');
            }
        });

        it('throws error when query is an empty object', () => {
            try {
                collectionValidators.isQueryValid({});
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Query contains other number than one logical operator');
            }
        });

        it('throws error when query is an object with more than one key', () => {
            try {
                collectionValidators.isQueryValid({ and: [], or: [] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Query contains other number than one logical operator');
            }
        });

        it('throws error when query has not listed key', () => {
            try {
                collectionValidators.isQueryValid({ eq: 1 });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Query contains invalid logical operators');
            }
        });

        it('throws error when expressions list is not an array', () => {
            try {
                collectionValidators.isQueryValid({ or: { eq: 1, neq: 1000 } });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Expressions list is not an array');
            }
        });

        it('throws error when expressions list is an empty array', () => {
            try {
                collectionValidators.isQueryValid({ or: [] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Expressions list is empty');
            }
        });

        it('throws error when an expression is not an object', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: 21 } }, null, { name: { eq: 'John' } }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('At least one expression is not an object');
            }
        });

        it('throws error when an expression has not only one field listed', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: 21 } }, { name: { eq: 'John' }, job: 'Teacher' }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Expression has other number than one field');
            }
        });

        it('throws error when an expression has non-string field', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: 21 } }, { 1: { eq: 'John' } }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Expression field is not a string');
            }
        });

        it('throws error when a condition is not an object', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: 21 } }, { name: 'John' }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Condition is not an object');
            }
        });

        it('throws error when a condition has not only one filter listed', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: 21, gte: 18 } }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Condition has other number than one filter');
            }
        });

        it('throws error when filter is not known', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { equal: 21 } }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Filter name is not known');
            }
        });

        it('throws error when reference value is not a primitive', () => {
            try {
                collectionValidators.isQueryValid({ or: [{ age: { eq: { number: 21 } } }] });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.FindQueryError);
                expect(e.message).toBe('Reference value is not primitive');
            }
        });

        it('returns true when query is valid', () => {
            expect(collectionValidators.isQueryValid({ and: [{ age: { gte: 21 } }] })).toBe(true);
            expect(collectionValidators.isQueryValid({ or: [{ age: { gte: 21 } }, { name: { eq: 'John' } }] })).toBe(true);
        });
    });
});