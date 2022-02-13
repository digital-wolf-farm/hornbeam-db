import { filters } from '../../../src/lib/filters';

// INFO: Only primitive value valid for JSON format (string, number, boolean and null) should be passed to filters

describe('Filter', () => {
    describe('Equal (case-sensitive) - "eq"', () => {
        it('should return true when elements are equal', () => {
            expect(filters.eq('text', 'text')).toBe(true);
            expect(filters.eq('Text', 'Text')).toBe(true);
            expect(filters.eq(1001, 1001)).toBe(true);
            expect(filters.eq(true, true)).toBe(true);
            expect(filters.eq(null, null)).toBe(true);
        });

        it('should return false when elements are not equal', () => {
            expect(filters.eq('text', 'Text')).toBe(false);
            expect(filters.eq('1001', 1001)).toBe(false);
            expect(filters.eq(true, false)).toBe(false);
            expect(filters.eq('', null)).toBe(false);
            expect(filters.eq(0, null)).toBe(false);
            expect(filters.eq(false, null)).toBe(false);
        });
    });

    describe('Equal (case-insensitive) - "eqi"', () => {
        it('should return true when elements are equal', () => {
            expect(filters.eqi('text', 'text')).toBe(true);
            expect(filters.eqi('Text', 'Text')).toBe(true);
            expect(filters.eqi('text', 'Text')).toBe(true);
            expect(filters.eqi(1001, 1001)).toBe(true);
            expect(filters.eqi(true, true)).toBe(true);
            expect(filters.eqi(null, null)).toBe(true);
        });

        it('should return false when elements are not equal', () => {
            expect(filters.eqi('text', 'text1')).toBe(false);
            expect(filters.eqi('1001', 1001)).toBe(false);
            expect(filters.eqi(true, false)).toBe(false);
            expect(filters.eqi('', null)).toBe(false);
            expect(filters.eqi(0, null)).toBe(false);
            expect(filters.eqi(false, null)).toBe(false);
        });
    });
});