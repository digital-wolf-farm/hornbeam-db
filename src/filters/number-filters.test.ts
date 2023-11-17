import { numberFilters } from './number-filters';

describe('NumberFilters', () => {
    describe('gt', () => {
        it('returns false when entry is not a number', () => {
            expect(numberFilters.gt('a', 1)).toBe(false);
            expect(numberFilters.gt(true, 2)).toBe(false);
            expect(numberFilters.gt(null, 3)).toBe(false);
            expect(numberFilters.gt(undefined, 4)).toBe(false);
            expect(numberFilters.gt([], 5)).toBe(false);
            expect(numberFilters.gt({}, 6)).toBe(false);
        });

        it('returns false when reference value is not a number', () => {
            expect(numberFilters.gt(1, 'a')).toBe(false);
            expect(numberFilters.gt(2, true)).toBe(false);
            expect(numberFilters.gt(3, null)).toBe(false);
            expect(numberFilters.gt(4, undefined)).toBe(false);
            expect(numberFilters.gt(5, [])).toBe(false);
            expect(numberFilters.gt(6, {})).toBe(false);
        });

        it('returns false when both values are numbers but entry value is not greater than reference', () => {
            expect(numberFilters.gt(-2, -1)).toBe(false);
            expect(numberFilters.gt(-1, -1)).toBe(false);
            expect(numberFilters.gt(-1, 0)).toBe(false);
            expect(numberFilters.gt(0, 0)).toBe(false);
            expect(numberFilters.gt(0, 1)).toBe(false);
            expect(numberFilters.gt(1, 2)).toBe(false);
            expect(numberFilters.gt(2, 2)).toBe(false);
        });

        it('returns true when both values are numbers and entry value is greater than reference', () => {
            expect(numberFilters.gt(-1, -2)).toBe(true);
            expect(numberFilters.gt(0, -1)).toBe(true);
            expect(numberFilters.gt(1, 0)).toBe(true);
            expect(numberFilters.gt(2, 1)).toBe(true);
        });

        it('returns false when after string to number coercion entry value is not greater than reference', () => {
            expect(numberFilters.gt('-50', -49)).toBe(false);
            expect(numberFilters.gt('0', '0')).toBe(false);
            expect(numberFilters.gt(99, '100')).toBe(false);
        });

        it('returns true when after string to number coercion entry value is greater than reference', () => {
            expect(numberFilters.gt('-50', -51)).toBe(true);
            expect(numberFilters.gt('0', '-1')).toBe(true);
            expect(numberFilters.gt(101, '100')).toBe(true);
        });
    });

    describe('gte', () => {
        it('returns false when entry is not a number', () => {
            expect(numberFilters.gte('a', 1)).toBe(false);
            expect(numberFilters.gte(true, 2)).toBe(false);
            expect(numberFilters.gte(null, 3)).toBe(false);
            expect(numberFilters.gte(undefined, 4)).toBe(false);
            expect(numberFilters.gte([], 5)).toBe(false);
            expect(numberFilters.gte({}, 6)).toBe(false);
        });

        it('returns false when reference value is not a number', () => {
            expect(numberFilters.gte(1, 'a')).toBe(false);
            expect(numberFilters.gte(2, true)).toBe(false);
            expect(numberFilters.gte(3, null)).toBe(false);
            expect(numberFilters.gte(4, undefined)).toBe(false);
            expect(numberFilters.gte(5, [])).toBe(false);
            expect(numberFilters.gte(6, {})).toBe(false);
        });

        it('returns false when both values are numbers but entry value is less than reference', () => {
            expect(numberFilters.gte(-2, -1)).toBe(false);
            expect(numberFilters.gte(-1, 0)).toBe(false);
            expect(numberFilters.gte(0, 1)).toBe(false);
            expect(numberFilters.gte(1, 2)).toBe(false);
        });

        it('returns true when both values are numbers and entry value is greater than or equal to reference', () => {
            expect(numberFilters.gte(-1, -2)).toBe(true);
            expect(numberFilters.gte(-1, -1)).toBe(true);
            expect(numberFilters.gte(0, -1)).toBe(true);
            expect(numberFilters.gte(0, 0)).toBe(true);
            expect(numberFilters.gte(1, 0)).toBe(true);
            expect(numberFilters.gte(2, 1)).toBe(true);
            expect(numberFilters.gte(2, 2)).toBe(true);
        });

        it('returns false when after string to number coercion entry value is not greater than reference', () => {
            expect(numberFilters.gte('-50', -49)).toBe(false);
            expect(numberFilters.gte('0', '1')).toBe(false);
            expect(numberFilters.gte(99, '100')).toBe(false);
        });

        it('returns true when after string to number coercion entry value is greater than or equal to reference', () => {
            expect(numberFilters.gte('-50', -51)).toBe(true);
            expect(numberFilters.gte('-50', -50)).toBe(true);
            expect(numberFilters.gte('0', '-1')).toBe(true);
            expect(numberFilters.gte('0', '0')).toBe(true);
            expect(numberFilters.gte(100, '100')).toBe(true);
            expect(numberFilters.gte(101, '100')).toBe(true);
        });
    });

    describe('lt', () => {
        it('returns false when entry is not a number', () => {
            expect(numberFilters.lt('a', 1)).toBe(false);
            expect(numberFilters.lt(true, 2)).toBe(false);
            expect(numberFilters.lt(null, 3)).toBe(false);
            expect(numberFilters.lt(undefined, 4)).toBe(false);
            expect(numberFilters.lt([], 5)).toBe(false);
            expect(numberFilters.lt({}, 6)).toBe(false);
        });

        it('returns false when reference value is not a number', () => {
            expect(numberFilters.lt(1, 'a')).toBe(false);
            expect(numberFilters.lt(2, true)).toBe(false);
            expect(numberFilters.lt(3, null)).toBe(false);
            expect(numberFilters.lt(4, undefined)).toBe(false);
            expect(numberFilters.lt(5, [])).toBe(false);
            expect(numberFilters.lt(6, {})).toBe(false);
        });

        it('returns false when both values are numbers but entry value is not less than reference', () => {
            expect(numberFilters.lt(-2, -3)).toBe(false);
            expect(numberFilters.lt(-1, -1)).toBe(false);
            expect(numberFilters.lt(0, -1)).toBe(false);
            expect(numberFilters.lt(0, 0)).toBe(false);
            expect(numberFilters.lt(1, 0)).toBe(false);
            expect(numberFilters.lt(3, 2)).toBe(false);
            expect(numberFilters.lt(3, 3)).toBe(false);
        });

        it('returns true when both values are numbers and entry value is less than reference', () => {
            expect(numberFilters.lt(-2, -1)).toBe(true);
            expect(numberFilters.lt(-1, 0)).toBe(true);
            expect(numberFilters.lt(0, 1)).toBe(true);
            expect(numberFilters.lt(1, 2)).toBe(true);
        });

        it('returns false when after string to number coercion entry value is not less than reference', () => {
            expect(numberFilters.lt('-50', -51)).toBe(false);
            expect(numberFilters.lt('0', '0')).toBe(false);
            expect(numberFilters.lt(101, '100')).toBe(false);
        });

        it('returns true when after string to number coercion entry value is less than reference', () => {
            expect(numberFilters.lt('-50', -49)).toBe(true);
            expect(numberFilters.lt('0', '1')).toBe(true);
            expect(numberFilters.lt(99, '100')).toBe(true);
        });
    });

    describe('lte', () => {
        it('returns false when entry is not a number', () => {
            expect(numberFilters.lte('a', 1)).toBe(false);
            expect(numberFilters.lte(true, 2)).toBe(false);
            expect(numberFilters.lte(null, 3)).toBe(false);
            expect(numberFilters.lte(undefined, 4)).toBe(false);
            expect(numberFilters.lte([], 5)).toBe(false);
            expect(numberFilters.lte({}, 6)).toBe(false);
        });

        it('returns false when reference value is not a number', () => {
            expect(numberFilters.lte(1, 'a')).toBe(false);
            expect(numberFilters.lte(2, true)).toBe(false);
            expect(numberFilters.lte(3, null)).toBe(false);
            expect(numberFilters.lte(4, undefined)).toBe(false);
            expect(numberFilters.lte(5, [])).toBe(false);
            expect(numberFilters.lte(6, {})).toBe(false);
        });

        it('returns false when both values are numbers but entry value is greater than reference', () => {
            expect(numberFilters.lte(-1, -2)).toBe(false);
            expect(numberFilters.lte(0, -1)).toBe(false);
            expect(numberFilters.lte(1, 0)).toBe(false);
            expect(numberFilters.lte(2, 1)).toBe(false);
        });

        it('returns true when both values are numbers and entry value is less than or equal to reference', () => {
            expect(numberFilters.lte(-2, -1)).toBe(true);
            expect(numberFilters.lte(-1, -1)).toBe(true);
            expect(numberFilters.lte(-1, 0)).toBe(true);
            expect(numberFilters.lte(0, 0)).toBe(true);
            expect(numberFilters.lte(0, 1)).toBe(true);
            expect(numberFilters.lte(1, 2)).toBe(true);
            expect(numberFilters.lte(2, 2)).toBe(true);
        });

        it('returns false when after string to number coercion entry value is not less than reference', () => {
            expect(numberFilters.lte('-50', -51)).toBe(false);
            expect(numberFilters.lte('0', '-1')).toBe(false);
            expect(numberFilters.lte(100, '99')).toBe(false);
        });

        it('returns true when after string to number coercion entry value is less than or equal to reference', () => {
            expect(numberFilters.lte('-51', -50)).toBe(true);
            expect(numberFilters.lte('-50', -50)).toBe(true);
            expect(numberFilters.lte('-1', '0')).toBe(true);
            expect(numberFilters.lte('0', '0')).toBe(true);
            expect(numberFilters.lte(100, '100')).toBe(true);
            expect(numberFilters.lte(100, '101')).toBe(true);
        });
    });
});
