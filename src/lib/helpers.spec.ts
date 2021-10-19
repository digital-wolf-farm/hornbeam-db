import { helpers } from './helpers';

describe('Helpers', () => {
    describe('CalculateDatabaseUsage', () => {
        const sizeLimit = 1;

        it('should calculate usage for passed string value', () => {
            const data = 'test1'.repeat(1024);

            expect(parseFloat(helpers.calculateDatabaseUsage(data, sizeLimit))).toBeLessThan(100.00);
        });

        it('should calculate usage for passed object value', () => {
            const data = {
                key1: 'test1'.repeat(1024),
                key2: 'test2'.repeat(1024)
            }

            expect(parseFloat(helpers.calculateDatabaseUsage(data, sizeLimit))).toBeLessThan(100.00);
        });

        it('should calculate usage for passed array value', () => {
            const data = ['test1'.repeat(1024), 'test2'.repeat(1024)];

            expect(parseFloat(helpers.calculateDatabaseUsage(data, sizeLimit))).toBeLessThan(100.00);
        });

        it('should calculate usage for passed date value', () => {
            const data = new Date();

            expect(parseFloat(helpers.calculateDatabaseUsage(data, sizeLimit))).toBeLessThan(100.00);
        });

        it('should calculate usage for passed null value', () => {
            const data = null;

            expect(parseFloat(helpers.calculateDatabaseUsage(data, sizeLimit))).toBeLessThan(100.00);
        });
    });
});
