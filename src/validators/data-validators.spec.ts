import { DatabaseError } from '../models/enums';
import { dataValidators } from './data-validators';

describe('DataValidators', () => {
    describe('isDataSchemaValid', () => {
        it('throws error when data is not an object', () => {
            try {
                dataValidators.isDataSchemaValid([]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSchemaMismatch);
                expect(e.message).toBe('Data is not an object');
            }
        });
    });

    describe('isSizeLimitValid', () => {
        it('throws error when size is a string', () => {
            try {
                dataValidators.isSizeLimitValid('1');
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit is not a positive integer');
            }
        });

        it('throws error when size is a new Number()', () => {
            try {
                dataValidators.isSizeLimitValid(new Number('1'));
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit is not a positive integer');
            }
        });

        it('throws error when size is equal to 0', () => {
            try {
                dataValidators.isSizeLimitValid(0);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit is not a positive integer');
            }
        });

        it('throws error when size is a negative integer', () => {
            try {
                dataValidators.isSizeLimitValid(-10);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit is not a positive integer');
            }
        });

        it('throws error when size is a positive floating number', () => {
            try {
                dataValidators.isSizeLimitValid(1.5);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit is not a positive integer');
            }
        });

        it('throws error when size is a positive integer greater than 1000', () => {
            try {
                dataValidators.isSizeLimitValid(1001);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.DataSizeLimitFormatError);
                expect(e.message).toBe('Data size limit exceeds 1000MB');
            }
        });

        it('returns true when size is a positive integer less than 1000', () => {
            let verificationResult: boolean;

            try {
                verificationResult =  dataValidators.isSizeLimitValid(100);
            } catch (e) {
                expect(true).toBe(false);
            }

            expect(verificationResult).toBe(true);
        });
    });
});