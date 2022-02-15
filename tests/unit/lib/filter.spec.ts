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

    describe('Not equal (case-sensitive) - "neq"', () => {
        it('should return true when elements are not equal', () => {
            expect(filters.neq('Text', 'text')).toBe(true);
            expect(filters.neq(1001, '1001')).toBe(true);
            expect(filters.neq(true, false)).toBe(true);
            expect(filters.neq('', null)).toBe(true);
            expect(filters.neq(0, null)).toBe(true);
            expect(filters.neq(false, null)).toBe(true);
        });

        it('should return false when elements are equal', () => {
            expect(filters.neq('text', 'text')).toBe(false);
            expect(filters.neq('Text', 'Text')).toBe(false);
            expect(filters.neq(1001, 1001)).toBe(false);
            expect(filters.neq(false, false)).toBe(false);
            expect(filters.neq(null, null)).toBe(false);
        });
    });

    describe('Not equal (case-insensitive) - "neqi"', () => {
        it('should return true when elements are not equal', () => {
            expect(filters.neqi('Text', 'texts')).toBe(true);
            expect(filters.neqi(1001, '1001')).toBe(true);
            expect(filters.neqi(true, false)).toBe(true);
            expect(filters.neqi('', null)).toBe(true);
            expect(filters.neqi(0, null)).toBe(true);
            expect(filters.neqi(false, null)).toBe(true);
        });

        it('should return false when elements are equal', () => {
            expect(filters.neqi('Text', 'text')).toBe(false);
            expect(filters.neqi('text', 'text')).toBe(false);
            expect(filters.neqi('Text', 'Text')).toBe(false);
            expect(filters.neqi(1001, 1001)).toBe(false);
            expect(filters.neqi(false, false)).toBe(false);
            expect(filters.neqi(null, null)).toBe(false);
        });
    });

    describe('Greater than - "gt"', () => {
        it('should return true when both elements are numbers and entry value is greater than reference value', () => {
            expect(filters.gt(100, 99)).toBe(true);
            expect(filters.gt(-10, -11)).toBe(true);
            expect(filters.gt(1, 0)).toBe(true);
            expect(filters.gt(0, -1)).toBe(true);
        });

        it('should return false when both elements are numbers but entry value is not greater than reference value', () => {
            expect(filters.gt(100, 100)).toBe(false);
            expect(filters.gt(0, 0)).toBe(false);
            expect(filters.gt(0, 1)).toBe(false);
            expect(filters.gt(-1, 0)).toBe(false);
            expect(filters.gt(-10, -9)).toBe(false);
        });

        it('should return false when at least one elements is not a number', () => {
            expect(filters.gt('2', 1)).toBe(false);
            expect(filters.gt(2, '1')).toBe(false);
            expect(filters.gt('10', '9')).toBe(false);
            expect(filters.gt('a', 'b')).toBe(false);
            expect(filters.gt('b', 'a')).toBe(false);
            expect(filters.gt(null, null)).toBe(false);
            expect(filters.gt(true, false)).toBe(false);
        });
    });

    describe('Greater than or equal to - "gte"', () => {
        it('should return true when both elements are numbers and entry value is greater than or equal to reference value', () => {
            expect(filters.gte(100, 99)).toBe(true);
            expect(filters.gte(-10, -11)).toBe(true);
            expect(filters.gte(1, 0)).toBe(true);
            expect(filters.gte(0, -1)).toBe(true);
            expect(filters.gte(0, 0)).toBe(true);
            expect(filters.gte(1001, 1001)).toBe(true);
            expect(filters.gte(-10, -10)).toBe(true);
        });

        it('should return false when both elements are numbers but entry value is less than reference value', () => {
            expect(filters.gte(99, 100)).toBe(false);
            expect(filters.gte(-1, 0)).toBe(false);
            expect(filters.gte(0, 1)).toBe(false);
            expect(filters.gte(-10, -9)).toBe(false);
        });

        it('should return false when at least one elements is not a number', () => {
            expect(filters.gte('2', 2)).toBe(false);
            expect(filters.gte(2, '2')).toBe(false);
            expect(filters.gte('10', '10')).toBe(false);
            expect(filters.gte('a', 'a')).toBe(false);
            expect(filters.gte('b', 'a')).toBe(false);
            expect(filters.gte(null, null)).toBe(false);
            expect(filters.gte(true, false)).toBe(false);
        });
    });

    describe('Less than - "lt"', () => {
        it('should return true when both elements are numbers and entry value is less than reference value', () => {
            expect(filters.lt(99, 100)).toBe(true);
            expect(filters.lt(-11, -10)).toBe(true);
            expect(filters.lt(-1, 0)).toBe(true);
            expect(filters.lt(0, 1)).toBe(true);
        });

        it('should return false when both elements are numbers but entry value is not less than reference value', () => {
            expect(filters.lt(100, 100)).toBe(false);
            expect(filters.lt(0, 0)).toBe(false);
            expect(filters.lt(1, 0)).toBe(false);
            expect(filters.lt(0, -1)).toBe(false);
            expect(filters.lt(-10, -10)).toBe(false);
        });

        it('should return false when at least one elements is not a number', () => {
            expect(filters.lt('1', 2)).toBe(false);
            expect(filters.lt(1, '2')).toBe(false);
            expect(filters.lt('9', '10')).toBe(false);
            expect(filters.lt('a', 'b')).toBe(false);
            expect(filters.lt('b', 'a')).toBe(false);
            expect(filters.lt(null, null)).toBe(false);
            expect(filters.lt(true, false)).toBe(false);
        });
    });

    describe('Less than or equal to - "lte"', () => {
        it('should return true when both elements are numbers and entry value is less than or equal to reference value', () => {
            expect(filters.lte(99, 100)).toBe(true);
            expect(filters.lte(-10, -9)).toBe(true);
            expect(filters.lte(-1, 0)).toBe(true);
            expect(filters.lte(0, 1)).toBe(true);
            expect(filters.lte(0, 0)).toBe(true);
            expect(filters.lte(1001, 1001)).toBe(true);
            expect(filters.lte(-10, -10)).toBe(true);
        });

        it('should return false when both elements are numbers but entry value is greater than reference value', () => {
            expect(filters.lte(100, 99)).toBe(false);
            expect(filters.lte(1, 0)).toBe(false);
            expect(filters.lte(0, -1)).toBe(false);
            expect(filters.lte(-9, -10)).toBe(false);
        });

        it('should return false when at least one elements is not a number', () => {
            expect(filters.lte('2', 2)).toBe(false);
            expect(filters.lte(2, '2')).toBe(false);
            expect(filters.lte('10', '10')).toBe(false);
            expect(filters.lte('a', 'a')).toBe(false);
            expect(filters.lte('b', 'a')).toBe(false);
            expect(filters.lte(null, null)).toBe(false);
            expect(filters.lte(true, false)).toBe(false);
        });
    });

    describe('Exist - "exist"', () => {
        it('should return true when elements exists and passed true as reference', () => {
            expect(filters.exist('text', true)).toBe(true);
            expect(filters.exist(1, true)).toBe(true);
            expect(filters.exist(true, true)).toBe(true);
        });

        it('should return false when elements doesn\'t exist but passed true as reference', () => {
            expect(filters.exist('', true)).toBe(false);
            expect(filters.exist(0, true)).toBe(false);
            expect(filters.exist(false, true)).toBe(false);
            expect(filters.exist(null, true)).toBe(false);
        });

        it('should return true when elements doesn\'t exist but passed false as reference', () => {
            expect(filters.exist('', false)).toBe(true);
            expect(filters.exist(0, false)).toBe(true);
            expect(filters.exist(false, false)).toBe(true);
            expect(filters.exist(null, false)).toBe(true);
        });

        it('should return false when elements exists and passed false as reference', () => {
            expect(filters.exist('text', false)).toBe(false);
            expect(filters.exist(1, false)).toBe(false);
            expect(filters.exist(true, false)).toBe(false);
        });
    });
});
