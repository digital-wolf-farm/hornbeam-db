import { promises as fs } from 'fs';

import { fileOperations } from './file-operations';
import { DBTaskError } from '../enums/db-task-error';
import { helpers } from './helpers';

describe('File operations', () => {
    const filePath = 'path/to/file.json';
    const sizeLimit = 1;
    const data = { collection1: [], collection: [{ field1: 'A', field2: 'B' }] };

    describe('Write', () => {
        it('should write file when size is less than 100% and no exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('99.99');

            expect(await fileOperations.write(filePath, data, sizeLimit)).resolves;
        });

        it('should throw error when size is equal to 100%', async () => {
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('100');

            return await fileOperations.write(filePath, data, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.DatabaseSizeExceeded);
                });
        });

        it('should throw error when size is greater than 100%', async () => {
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('100.01');

            return await fileOperations.write(filePath, data, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.DatabaseSizeExceeded);
                });
        });

        it('should throw error when size is less than 100% but exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockRejectedValueOnce('error');
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('25.30');

            return await fileOperations.write(filePath, data, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileWriteError);
                });
        });
    });

    describe('Read', () => {
        const fileContent = JSON.stringify(data);

        it('should return file content when size is less than 100% and no exception occurs', async () => {
            jest.spyOn(fs, 'readFile').mockResolvedValueOnce(fileContent);
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('99.99');

            await expect(fileOperations.read(filePath, sizeLimit)).resolves.toEqual(data);
        });

        it('should throw error when size is equal to 100%', async () => {
            jest.spyOn(fs, 'readFile').mockResolvedValueOnce(fileContent);
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('100');

            return await fileOperations.read(filePath, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileSizeExceeded);
                });
        });

        it('should throw error when size is greater than 100%', async () => {
            jest.spyOn(fs, 'readFile').mockResolvedValueOnce(fileContent);
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('100.01');

            return await fileOperations.read(filePath, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileSizeExceeded);
                });
        });

        it('should throw error when file not found', async () => {
            jest.spyOn(fs, 'readFile').mockRejectedValueOnce({ code: 'ENOENT' });

            return await fileOperations.read(filePath, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileNotFound);
                });
        });

        it('should throw error when exception occur', async () => {
            jest.spyOn(fs, 'readFile').mockRejectedValueOnce('error');

            return await fileOperations.read(filePath, sizeLimit)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileReadError);
                });
        });
    });
});
