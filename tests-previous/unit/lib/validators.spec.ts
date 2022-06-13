import { validators } from '../../../src/lib/validators';

describe.skip('Validators', () => {
    describe('validateCollectionName', () => {
        const minLength = 4;
        const maxLength = 12;

        it('should return true when valid collection name is passed', () => {
            expect(validators.validateCollectionName('coll', minLength, maxLength)).toBe(true);
            expect(validators.validateCollectionName('col1', minLength, maxLength)).toBe(true);
            expect(validators.validateCollectionName('collection-1', minLength, maxLength)).toBe(true);
            expect(validators.validateCollectionName('collection_1', minLength, maxLength)).toBe(true);
            expect(validators.validateCollectionName('collection1', minLength, maxLength)).toBe(true);
            expect(validators.validateCollectionName('test-name_1', minLength, maxLength)).toBe(true);
        });

        it('should return false when valid collection name is passed', () => {
            expect(validators.validateCollectionName('abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('abc123abc123abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('123abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('_abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('-abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('$abc', minLength, maxLength)).toBe(false);
            expect(validators.validateCollectionName('abc#1', minLength, maxLength)).toBe(false);
        });
    });

    describe('validatePath', () => {
        it('should return true when valid path is passed', () => {
            expect(validators.validatePath('C:\Users\MyUser')).toBe(true);
            expect(validators.validatePath('C:\Users\MyUser\AppDirectory\file.json')).toBe(true);
        });

        it('should return true when invalid path is passed', () => {
            expect(validators.validatePath('./file.json')).toBe(false);
            expect(validators.validatePath('../file.json')).toBe(false);
            expect(validators.validatePath('../directory/file.json')).toBe(false);
        });
    });
});
