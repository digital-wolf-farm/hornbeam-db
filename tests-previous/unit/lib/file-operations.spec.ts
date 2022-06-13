import { promises as fs } from 'fs';

import { fileOperations } from '../../../src/lib/file-operations';
import { DBTaskError } from '../../../src/models/enums';

describe.skip('File operations', () => {
    const filePath = 'path/to/file.json';
    const data = { collection1: [], collection2: [] };

    describe('Write', () => {
        it('should write file when no exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();

            expect(await fileOperations.write(filePath, data)).resolves;
        });

        it('should throw error when exception occurs', async () => {
            jest.spyOn(fs, 'writeFile').mockRejectedValueOnce('error');

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
