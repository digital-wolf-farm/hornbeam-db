import { basicFilters } from './basic-filters';

describe('BasicFilters', () => {
    describe('exist', () => {
        it('returns false when reference value is not a boolean', () => {
            expect(basicFilters.exist([], 'true')).toBe(false);
            expect(basicFilters.exist('', 1)).toBe(false);
        });

        it('returns false when element is not defined and reference value is set to true', () => {
            expect(basicFilters.exist(null, true)).toBe(false);
            expect(basicFilters.exist(undefined, true)).toBe(false);
        });

        it('returns true when element is not defined and reference value is set to false', () => {
            expect(basicFilters.exist(null, false)).toBe(true);
            expect(basicFilters.exist(undefined, false)).toBe(true);
        });

        it('returns true when element is defined and reference value is set to true', () => {
            expect(basicFilters.exist('', true)).toBe(true);
            expect(basicFilters.exist(1, true)).toBe(true);
            expect(basicFilters.exist(false, true)).toBe(true);
            expect(basicFilters.exist(true, true)).toBe(true);
            expect(basicFilters.exist([], true)).toBe(true);
            expect(basicFilters.exist({}, true)).toBe(true);
        });

        it('returns false when element is defined and reference value is set to false', () => {
            expect(basicFilters.exist('', false)).toBe(false);
            expect(basicFilters.exist(1, false)).toBe(false);
            expect(basicFilters.exist(false, false)).toBe(false);
            expect(basicFilters.exist(true, false)).toBe(false);
            expect(basicFilters.exist([], false)).toBe(false);
            expect(basicFilters.exist({}, false)).toBe(false);
        });
    });

    describe('eq', () => {
        it('returns false when compared elements are primitive values and are different', () => {
            expect(basicFilters.eq('wolf', 'fox')).toBe(false);
            expect(basicFilters.eq(1, 2)).toBe(false);
            expect(basicFilters.eq(true, false)).toBe(false);
        });

        it('returns true when compared elements are primitive values and are the same', () => {
            expect(basicFilters.eq('wolf', 'wolf')).toBe(true);
            expect(basicFilters.eq(1, 1)).toBe(true);
            expect(basicFilters.eq(true, true)).toBe(true);
        });

        it('returns false when at least one of values is not primitive', () => {
            expect(basicFilters.eq({}, '')).toBe(false);
            expect(basicFilters.eq([], 0)).toBe(false);
            expect(basicFilters.eq('1', {})).toBe(false);
            expect(basicFilters.eq(true, [])).toBe(false);
            expect(basicFilters.eq([], [])).toBe(false);
            expect(basicFilters.eq({}, {})).toBe(false);
        });

        it('returns true when one of values is a string and another is a number and after coercion are equal', () => {
            expect(basicFilters.eq('101', 101)).toBe(true);
            expect(basicFilters.eq(99, '99')).toBe(true);
        });

        it('returns false when one of values is a string and another is a number and after coercion are not equal', () => {
            expect(basicFilters.eq('101', 102)).toBe(false);
            expect(basicFilters.eq(98, '99')).toBe(false);
        });

        it('returns false when both values are string but with different letter case', () => {
            expect(basicFilters.eq('wolf', 'Wolf')).toBe(false);
            expect(basicFilters.eq('WOLF', 'wolf')).toBe(false);
        });
    });

    describe('eqi', () => {
        it('returns false when compared elements are primitive values and are different', () => {
            expect(basicFilters.eqi('wolf', 'fox')).toBe(false);
            expect(basicFilters.eqi(1, 2)).toBe(false);
            expect(basicFilters.eqi(true, false)).toBe(false);
        });

        it('returns true when compared elements are primitive values and are the same', () => {
            expect(basicFilters.eqi('wolf', 'wolf')).toBe(true);
            expect(basicFilters.eqi(1, 1)).toBe(true);
            expect(basicFilters.eqi(true, true)).toBe(true);
        });

        it('returns false when at least one of values is not primitive', () => {
            expect(basicFilters.eqi({}, '')).toBe(false);
            expect(basicFilters.eqi([], 0)).toBe(false);
            expect(basicFilters.eqi('1', {})).toBe(false);
            expect(basicFilters.eqi(true, [])).toBe(false);
            expect(basicFilters.eqi([], [])).toBe(false);
            expect(basicFilters.eqi({}, {})).toBe(false);
        });

        it('returns true when one of values is a string and another is a number and after coercion are equal', () => {
            expect(basicFilters.eqi('101', 101)).toBe(true);
            expect(basicFilters.eqi(99, '99')).toBe(true);
        });

        it('returns false when one of values is a string and another is a number and after coercion are not equal', () => {
            expect(basicFilters.eqi('101', 102)).toBe(false);
            expect(basicFilters.eqi(98, '99')).toBe(false);
        });

        it('returns true when both values are string but with different letter case', () => {
            expect(basicFilters.eqi('wolf', 'Wolf')).toBe(true);
            expect(basicFilters.eqi('WOLF', 'wolf')).toBe(true);
        });
    });

    describe('neq', () => {
        it('returns true when compared elements are primitive values and are different', () => {
            expect(basicFilters.neq('wolf', 'fox')).toBe(true);
            expect(basicFilters.neq(1, 2)).toBe(true);
            expect(basicFilters.neq(true, false)).toBe(true);
        });

        it('returns false when compared elements are primitive values and are the same', () => {
            expect(basicFilters.neq('wolf', 'wolf')).toBe(false);
            expect(basicFilters.neq(1, 1)).toBe(false);
            expect(basicFilters.neq(true, true)).toBe(false);
        });

        it('returns true when at least one of values is not primitive', () => {
            expect(basicFilters.neq({}, '')).toBe(true);
            expect(basicFilters.neq([], 0)).toBe(true);
            expect(basicFilters.neq('1', {})).toBe(true);
            expect(basicFilters.neq(true, [])).toBe(true);
            expect(basicFilters.neq([], [])).toBe(true);
            expect(basicFilters.neq({}, {})).toBe(true);
        });

        it('returns false when one of values is a string and another is a number and after coercion are equal', () => {
            expect(basicFilters.neq('101', 101)).toBe(false);
            expect(basicFilters.neq(99, '99')).toBe(false);
        });

        it('returns true when one of values is a string and another is a number and after coercion are not equal', () => {
            expect(basicFilters.neq('101', 102)).toBe(true);
            expect(basicFilters.neq(98, '99')).toBe(true);
        });

        it('returns true when both values are string but with different letter case', () => {
            expect(basicFilters.neq('wolf', 'Wolf')).toBe(true);
            expect(basicFilters.neq('WOLF', 'wolf')).toBe(true);
        });
    });

    describe('neqi', () => {
        it('returns true when compared elements are primitive values and are different', () => {
            expect(basicFilters.neqi('wolf', 'fox')).toBe(true);
            expect(basicFilters.neqi(1, 2)).toBe(true);
            expect(basicFilters.neqi(true, false)).toBe(true);
        });

        it('returns false when compared elements are primitive values and are the same', () => {
            expect(basicFilters.neqi('wolf', 'wolf')).toBe(false);
            expect(basicFilters.neqi(1, 1)).toBe(false);
            expect(basicFilters.neqi(true, true)).toBe(false);
        });

        it('returns true when at least one of values is not primitive', () => {
            expect(basicFilters.neqi({}, '')).toBe(true);
            expect(basicFilters.neqi([], 0)).toBe(true);
            expect(basicFilters.neqi('1', {})).toBe(true);
            expect(basicFilters.neqi(true, [])).toBe(true);
            expect(basicFilters.neqi([], [])).toBe(true);
            expect(basicFilters.neqi({}, {})).toBe(true);
        });

        it('returns false when one of values is a string and another is a number and after coercion are equal', () => {
            expect(basicFilters.neqi('101', 101)).toBe(false);
            expect(basicFilters.neqi(99, '99')).toBe(false);
        });

        it('returns true when one of values is a string and another is a number and after coercion are not equal', () => {
            expect(basicFilters.neqi('101', 102)).toBe(true);
            expect(basicFilters.neqi(98, '99')).toBe(true);
        });

        it('returns false when both values are string but with different letter case', () => {
            expect(basicFilters.neqi('wolf', 'Wolf')).toBe(false);
            expect(basicFilters.neqi('WOLF', 'wolf')).toBe(false);
        });
    });
});
