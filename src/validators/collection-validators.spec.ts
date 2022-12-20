import { DatabaseError } from '../models/enums';
import { collectionValidators } from './collection-validators';

describe('CollectionValidators', () => {
    describe('isCollectionIndexesListValid', () => {
        it('throws error when indexes list is not an array', () => {
            try {
                collectionValidators.isCollectionIndexesListValid({ name: false, login: true });
            } catch (e) {
                expect(e.name).toBe(DatabaseError.CollectionOptionsError);
                expect(e.message).toBe('Indexes argument is not an array');
            }
        });

        it('throws error when list is empty', () => {
            try {
                collectionValidators.isCollectionIndexesListValid([]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.CollectionOptionsError);
                expect(e.message).toBe('List of indexes is empty');
            }
        });

        it('throws error when at least one index is not a string', () => {
            try {
                collectionValidators.isCollectionIndexesListValid(['login', 'ssn', 1]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.CollectionOptionsError);
                expect(e.message).toBe('At least one of provided indexes is not a string');
            }
        });

        it('returns true when indexes list is an array of strings', () => {
            expect(collectionValidators.isCollectionIndexesListValid(['login'])).toBe(true);
            expect(collectionValidators.isCollectionIndexesListValid(['login', 'ssn'])).toBe(true);
        });
    });

    describe('isIdsListValid', () => {
        it('throws error when ids list is not an array', () => {
            try {
                collectionValidators.isIdsListValid(1);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntriesIdListError);
                expect(e.message).toBe('List of ids is not an array');
            }
        });

        it('throws error when list is empty', () => {
            try {
                collectionValidators.isIdsListValid([]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntriesIdListError);
                expect(e.message).toBe('List of ids is empty');
            }
        });

        it('throws error when at least one id is not a positive integer', () => {
            try {
                collectionValidators.isIdsListValid([1, 10, -100]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntriesIdListError);
                expect(e.message).toBe('At least one id is not a positive integer');
            }
        });

        it('throws error when at least one id is a floating number', () => {
            try {
                collectionValidators.isIdsListValid([1, 10, 1.2]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntriesIdListError);
                expect(e.message).toBe('At least one id is not a positive integer');
            }
        });

        it('throws error when at least one id is a string', () => {
            try {
                collectionValidators.isIdsListValid([1, 10, '100']);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntriesIdListError);
                expect(e.message).toBe('At least one id is not a positive integer');
            }
        });

        it('returns true when ids list is an array of positive integers', () => {
            expect(collectionValidators.isIdsListValid([1])).toBe(true);
            expect(collectionValidators.isIdsListValid([5, 15, 25])).toBe(true);
        });
    });

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
                collectionValidators.isQueryValid({ or: {eq: 1, neq: 1000} });
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
    });
});