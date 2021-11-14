import { verifiers } from '../../../src/lib/verifiers';
import { DBTaskError } from '../../../src/models/enums';

describe('Verifiers', () => {
    describe('isCollectionNameValid', () => {
        const config = { minLength: 4, maxLength: 12 }

        it('should return when valid collection name is passed', () => {
            try {
                verifiers.isCollectionNameValid('coll', config);
                verifiers.isCollectionNameValid('col1', config);
                verifiers.isCollectionNameValid('collection-1', config);
                verifiers.isCollectionNameValid('collection_1', config);
                verifiers.isCollectionNameValid('collection1', config);
                verifiers.isCollectionNameValid('test-name_1', config);
            } catch (e) {
                expect(true).toBe(false);
            }
        });

        it('should throw error when too short collection name is passed', () => {
            try {
                verifiers.isCollectionNameValid('abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when too long collection name is passed', () => {
            try {
                verifiers.isCollectionNameValid('abc123abc123abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when collection name starting with number is passed', () => {
            try {
                verifiers.isCollectionNameValid('123abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when collection name starting with "_" is passed', () => {
            try {
                verifiers.isCollectionNameValid('_abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when collection name starting with "-" is passed', () => {
            try {
                verifiers.isCollectionNameValid('-abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when collection name starting with other special character is passed', () => {
            try {
                verifiers.isCollectionNameValid('$abc', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

        it('should throw error when collection name containing special character other than "_" and "-" is passed', () => {
            try {
                verifiers.isCollectionNameValid('abc#1', config);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.error).toBe(DBTaskError.CollectionNameMismatch);
            }
        });

    });
});
