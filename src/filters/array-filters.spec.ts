import { arrayFilters } from './array-filters';

describe('ArrayFilters', () => {
    describe('all', () => {
        it('returns false when checked value is not an array', () => {
            expect(arrayFilters.all('checkedValue', ['books', 'cooking'])).toBe(false);
        });

        it('returns false when checked value is not an array of primitive values', () => {
            expect(arrayFilters.all([[], {}], ['books', 'cooking'])).toBe(false);
        });

        it('returns false when checked value is an array of booleans', () => {
            expect(arrayFilters.all([true, true, false], ['books', 'cooking'])).toBe(false);
        });

        it('returns false when reference value is not an array', () => {
            expect(arrayFilters.all(['books', 'cooking'], 'books')).toBe(false);
        });

        it('returns false when reference value is an array but contains non-primitive values', () => {
            expect(arrayFilters.all(['books', 'cooking'], [{}, []])).toBe(false);
        });

        it('returns false when reference value is an array of booleans', () => {
            expect(arrayFilters.all(['books', 'cooking'], [false, true])).toBe(false);
        });

        it('returns false when some values from reference array are not present in checked array', () => {
            expect(arrayFilters.all(['books'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all(['books', 'fishing'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all(['books', 'movies'], ['movies', 'cooking', 'books'])).toBe(false);
            expect(arrayFilters.all([5], [5, 8])).toBe(false);
            expect(arrayFilters.all([100, 101], [100, 101, 102])).toBe(false);
        });

        it('returns true when all values from reference array are present in checked array', () => {
            expect(arrayFilters.all(['books'], ['books'])).toBe(true);
            expect(arrayFilters.all(['books', 'cooking'], ['cooking', 'books'])).toBe(true);
            expect(arrayFilters.all(['books', 'movies', 'fishing', 'cooking'], ['movies', 'cooking', 'books'])).toBe(true);
            expect(arrayFilters.all([5, 8], [8])).toBe(true);
            expect(arrayFilters.all([100, 101, 102], [102, 101, 100])).toBe(true);
        });
    });

    describe('contain', () => {
        it('returns false when checked value is not an array', () => {
            expect(arrayFilters.contain('notArray', 'someValue')).toBe(false);
        });

        it('returns false when reference value is not a number or a string', () => {
            expect(arrayFilters.contain([1, 2, 3], [])).toBe(false);
            expect(arrayFilters.contain([1, 2, 3], {})).toBe(false);
            expect(arrayFilters.contain([1, 2, 3], true)).toBe(false);
        });

        it('returns false when checked value is array of numbers or strings without reference value', () => {
            expect(arrayFilters.contain([1, 2, 3], 4)).toBe(false);
            expect(arrayFilters.contain(['books', 'movies', 'sport'], 'cars')).toBe(false);
        });

        it('returns true when checked value is array of numbers or strings with reference value', () => {
            expect(arrayFilters.contain([1, 2, 3], 3)).toBe(true);
            expect(arrayFilters.contain(['books', 'movies', 'sport'], 'movies')).toBe(true);
        });
    });

    describe('size', () => {
        it('returns false when checked value is not an array', () => {
            expect(arrayFilters.size('notArray', 5)).toBe(false);
        });

        it('returns false when reference value is not a positive integer or 0', () => {
            expect(arrayFilters.size([1, 2, 3], '3')).toBe(false);
            expect(arrayFilters.size([1, 2, 3], 1.2)).toBe(false);
            expect(arrayFilters.size([1, 2, 3], -1)).toBe(false);
        });

        it('returns false when reference value is not equal to checked array length', () => {
            expect(arrayFilters.size([1, 2, 3], 2)).toBe(false);
        });

        it('returns true when reference value is equal to checked array length', () => {
            expect(arrayFilters.size([1, 2, 3], 3)).toBe(true);
            expect(arrayFilters.size([], 0)).toBe(true);
        });
    });
});
