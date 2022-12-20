import { Entry } from '..';
import { logicalFilters } from './logical-filters';

describe('LogicalFilters', () => {
    const entry: Entry = {
        _id: 1,
        name: 'John',
        surname: 'Smith',
        age: '48',
        job: 'teacher',
        hobbies: ['fishing', 'football']
    };

    describe('and', () => {
        it('returns false when at least one condition is false', () => {
            expect(logicalFilters.and(entry, [
                { age: { gte: 50 } }
            ])).toBe(false);

            expect(logicalFilters.and(entry, [
                { name: { eq: 'John' } },
                { age: { gte: 50 } }
            ])).toBe(false);

            expect(logicalFilters.and(entry, [
                { age: { gte: 50 } },
                { name: { eq: 'John' } },
                { hobbies: { all: ['football'] } },
            ])).toBe(false);
        });

        it('returns true when all conditions are true', () => {
            expect(logicalFilters.and(entry, [
                { age: { lt: 50 } }
            ])).toBe(true);

            expect(logicalFilters.and(entry, [
                { name: { eq: 'John' } },
                { age: { lt: 50 } }
            ])).toBe(true);

            expect(logicalFilters.and(entry, [
                { age: { lt: 50 } },
                { name: { eq: 'John' } },
                { hobbies: { all: ['football'] } },
            ])).toBe(true);
        });
    });

    describe('or', () => {
        it('returns false when all conditions are false', () => {
            expect(logicalFilters.or(entry, [
                { age: { gte: 50 } }
            ])).toBe(false);

            expect(logicalFilters.or(entry, [
                { name: { eq: 'Mary' } },
                { age: { gte: 50 } }
            ])).toBe(false);

            expect(logicalFilters.or(entry, [
                { age: { gte: 50 } },
                { name: { eq: 'Mary' } },
                { hobbies: { all: ['books'] } },
            ])).toBe(false);
        });

        it('returns true when at least one condition is true', () => {
            expect(logicalFilters.or(entry, [
                { age: { lt: 50 } }
            ])).toBe(true);

            expect(logicalFilters.or(entry, [
                { name: { eq: 'Mary' } },
                { age: { lt: 50 } }
            ])).toBe(true);

            expect(logicalFilters.or(entry, [
                { age: { lt: 50 } },
                { name: { eq: 'Mary' } },
                { hobbies: { all: ['books'] } },
            ])).toBe(true);
        });
    });
});
