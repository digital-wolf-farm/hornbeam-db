import { promises as fs } from 'fs';

import { fileOperations } from '../../../src/lib/file-operations';
import { DBTaskError } from '../../../src/models/enums';
import { helpers } from '../../../src/lib/helpers';

describe('File operations', () => {
    const filePath = 'path/to/file.json';
    const sizeLimit = 1;
    const data = { collection1: [], collection: [{ field1: 'A', field2: 'B' }] };

    describe('Write', () => {
        it('should write file when no exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('99.99');

            expect(await fileOperations.write(filePath, data)).resolves;
        });

        it('should throw error when exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockRejectedValueOnce('error');
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('25.30');

            return await fileOperations.write(filePath, data)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileWriteError);
                });
        });
    });

    describe('Read', () => {
        const fileContent = JSON.stringify(data);

        it('should return file content when no exception occurs', async () => {
            jest.spyOn(fs, 'readFile').mockResolvedValueOnce(fileContent);
            jest.spyOn(helpers, 'calculateDatabaseUsage').mockReturnValueOnce('99.99');

            await expect(fileOperations.read(filePath)).resolves.toEqual(data);
        });

        it('should throw error when file not found', async () => {
            jest.spyOn(fs, 'readFile').mockRejectedValueOnce({ code: 'ENOENT' });

            return await fileOperations.read(filePath)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileNotFound);
                });
        });

        it('should throw error when exception occur', async () => {
            jest.spyOn(fs, 'readFile').mockRejectedValueOnce('error');

            return await fileOperations.read(filePath)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileReadError);
                });
        });
    });
});
