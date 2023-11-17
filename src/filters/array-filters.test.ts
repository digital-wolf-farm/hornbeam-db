import { arrayFilters } from './array-filters';

describe('ArrayFilters', () => {
    describe('all', () => {
        it('returns false when checked value is not an array', () => {
            expect(arrayFilters.all('checkedValue', ['books', 'cooking'])).toBe(false);
        });

        it('returns false when checked value is an array but contains other values than strings or numbers', () => {
            expect(arrayFilters.all([true, 1], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all(['b', []], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all([{}, '3'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all([null, 'd'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all([undefined, 'e'], ['books', 'cooking'])).toBe(false);
        });

        it('returns false when reference value is not an array', () => {
            expect(arrayFilters.all(['books', 'cooking'], 'books')).toBe(false);
        });

        it('returns false when reference value is an array but contains other values than strings or numbers', () => {
            expect(arrayFilters.all(['books', 'cooking'], [true, 1])).toBe(false);
            expect(arrayFilters.all(['books', 'cooking'], ['b', []])).toBe(false);
            expect(arrayFilters.all(['books', 'cooking'], [{}, '3'])).toBe(false);
            expect(arrayFilters.all(['books', 'cooking'], [null, 'd'])).toBe(false);
            expect(arrayFilters.all(['books', 'cooking'], [undefined, 'e'])).toBe(false);
        });

        it('returns false when some values from reference array are not present in checked array', () => {
            expect(arrayFilters.all(['books'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all(['books', 'fishing'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.all(['books', 'movies'], ['movies', 'cooking', 'books'])).toBe(false);
            expect(arrayFilters.all([5], [5, 8])).toBe(false);
            expect(arrayFilters.all([100, 101], [100, 101, 102])).toBe(false);
        });

        it('returns true when every values from reference array are present in checked array', () => {
            expect(arrayFilters.all(['books'], ['books'])).toBe(true);
            expect(arrayFilters.all(['books'], ['BOOKS'])).toBe(true);
            expect(arrayFilters.all(['books', 'cooking'], ['cooking', 'books'])).toBe(true);
            expect(arrayFilters.all(['books', 'movies', 'fishing', 'cooking'], ['cooking', 'fishing'])).toBe(true);
            expect(arrayFilters.all([5, 8], [8])).toBe(true);
            expect(arrayFilters.all([100, 101, 102], [102, 101, 100])).toBe(true);
            expect(arrayFilters.all([999, 1000], ['999', '1000'])).toBe(true);
            expect(arrayFilters.all(['2000', '2001'], [2000, 2001])).toBe(true);
        });
    });

    describe('part', () => {
        it('returns false when checked value is not an array', () => {
            expect(arrayFilters.part('checkedValue', ['books', 'cooking'])).toBe(false);
        });

        it('returns false when checked value is an array but contains other values than strings or numbers', () => {
            expect(arrayFilters.part([true, 1], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part(['b', []], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part([{}, '3'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part([null, 'd'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part([undefined, 'e'], ['books', 'cooking'])).toBe(false);
        });

        it('returns false when reference value is not an array', () => {
            expect(arrayFilters.part(['books', 'cooking'], 'books')).toBe(false);
        });

        it('returns false when reference value is an array but contains other values than strings or numbers', () => {
            expect(arrayFilters.part(['books', 'cooking'], [true, 1])).toBe(false);
            expect(arrayFilters.part(['books', 'cooking'], ['b', []])).toBe(false);
            expect(arrayFilters.part(['books', 'cooking'], [{}, '3'])).toBe(false);
            expect(arrayFilters.part(['books', 'cooking'], [null, 'd'])).toBe(false);
            expect(arrayFilters.part(['books', 'cooking'], [undefined, 'e'])).toBe(false);
        });

        it('returns false when none of values from reference array are not present in checked array', () => {
            expect(arrayFilters.part(['movies'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part(['movies', 'baking'], ['books', 'cooking'])).toBe(false);
            expect(arrayFilters.part([11], [5, 8])).toBe(false);
            expect(arrayFilters.part([103, 105], [100, 101, 102])).toBe(false);
        });

        it('returns true when at least one value from reference array is present in checked array', () => {
            expect(arrayFilters.part(['books'], ['books'])).toBe(true);
            expect(arrayFilters.part(['books'], ['books', 'cooking'])).toBe(true);
            expect(arrayFilters.part(['books'], ['BOOKS'])).toBe(true);
            expect(arrayFilters.part(['books'], ['BOOKS', 'COOKING'])).toBe(true);
            expect(arrayFilters.part(['books', 'cooking'], ['cooking', 'books', 'movies'])).toBe(true);
            expect(arrayFilters.part(['books', 'movies', 'fishing', 'cooking'], ['running', 'fishing', 'bikes'])).toBe(true);
            expect(arrayFilters.part([5, 8], [8])).toBe(true);
            expect(arrayFilters.part([100, 101], [102, 101, 100])).toBe(true);
            expect(arrayFilters.part([999, 1000], ['999', '1000', '1001'])).toBe(true);
            expect(arrayFilters.part(['2000', '2001'], [2000, 2001, 2002])).toBe(true);
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
