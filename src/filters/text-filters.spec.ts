import { textFilters } from './text-filters';

describe('TextFilters', () => {
    describe('text', () => {
        it('returns false when checked value is not defined', () => {
            expect(textFilters.text(null, 'wolf')).toBe(false);
            expect(textFilters.text(undefined, 'wolf')).toBe(false);
        });

        it('returns false when search text is not a string', () => {
            expect(textFilters.text('Wolfs are...', 1)).toBe(false);
            expect(textFilters.text('Wolfs are...', null)).toBe(false);
            expect(textFilters.text('Wolfs are...', undefined)).toBe(false);
            expect(textFilters.text('Wolfs are...', true)).toBe(false);
            expect(textFilters.text('Wolfs are...', {})).toBe(false);
            expect(textFilters.text('Wolfs are...', [])).toBe(false);
        });

        it('returns false when search text is empty string', () => {
            expect(textFilters.text('Wolfs are...', '')).toBe(false);
        });

        it('returns false when checked value is a boolean', () => {
            expect(textFilters.text(true, 'wolf')).toBe(false);
        });

        it('returns false when checked value is a string but does not contain search string', () => {
            expect(textFilters.text('Fox is...', 'wolf')).toBe(false);
        });

        it('returns true when checked value is a string and contains search string', () => {
            expect(textFilters.text('Wolf is...', 'wolf')).toBe(true);
            expect(textFilters.text('Are wolfs dangerous...', 'Wolf')).toBe(true);
            expect(textFilters.text('I saw a wolf.', 'WOLF')).toBe(true);
        });

        it('returns false when checked value is a number but does not contain search string', () => {
            expect(textFilters.text(123, '456')).toBe(false);
        });

        it('returns true when checked value is a number and contains search string', () => {
            expect(textFilters.text(123456789, '123')).toBe(true);
            expect(textFilters.text(456123789, '123')).toBe(true);
            expect(textFilters.text(456789123, '123')).toBe(true);
        });

        it('returns false when checked value is an array but does not contain search string', () => {
            expect(textFilters.text([1, 2, 3], '4')).toBe(false);
            expect(textFilters.text([true, false], 'wolf')).toBe(false);
            expect(textFilters.text(['ab', 'be', 'cf'], 'd')).toBe(false);
            expect(textFilters.text([], 'e')).toBe(false);
            expect(textFilters.text([''], 'f')).toBe(false);
            expect(textFilters.text([{ a: 'g' }, { a: 'h' }], 'a')).toBe(false);
            expect(textFilters.text([['k', 'l'], ['m', 'n']], 'o')).toBe(false);
        });

        it('returns true when checked value is an array of string or numbers values and contains search string', () => {
            expect(textFilters.text([1, 2, 3], '2')).toBe(true);
            expect(textFilters.text(['ab', 'be', 'cf'], 'B')).toBe(true);
            expect(textFilters.text([{ a: 'g' }, { a: 'h' }], 'h')).toBe(true);
            expect(textFilters.text([['k', 'l'], ['m', 'n']], 'M')).toBe(true);
        });

        it('returns false when checked value is an object but does not contain search string', () => {
            expect(textFilters.text({}, 'a')).toBe(false);
            expect(textFilters.text({ b: 'c' }, 'b')).toBe(false);
            expect(textFilters.text({ d: 2 }, '3')).toBe(false);
            expect(textFilters.text({ e: { f: 'g' } }, 'h')).toBe(false);
            expect(textFilters.text({ i: ['j', 'k'] }, 'l')).toBe(false);
        });

        it('returns true when checked value is an object and contains search string', () => {
            expect(textFilters.text({ b: 'c' }, 'c')).toBe(true);
            expect(textFilters.text({ d: 2 }, '2')).toBe(true);
            expect(textFilters.text({ e: { f: 'g' } }, 'G')).toBe(true);
            expect(textFilters.text({ i: ['j', 'k'] }, 'K')).toBe(true);
        });
    });
});
