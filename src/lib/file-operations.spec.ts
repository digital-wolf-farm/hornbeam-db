import * as path from 'path';
import { promises as fs } from 'fs';

import { fileOperations } from './file-operations';
import { DBTaskError } from '../enums/db-task-error';

describe('File operations', () => {
    const filePath = path.resolve(__dirname, 'test.json');

    // TODO: Mock fs module

    afterEach(async () => {
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (e) {
            console.log('Attempt to remove non-existing file');
        }
    });

    describe('Write', () => {
        it('should write file when size is not exceeded', async () => {
            const data = { collection1: [], collection: [{ field1: 'A', field2: 'B' }] };

            expect(await fileOperations.write(filePath, data, 1)).resolves;
        });

        it('should not write file when size is exceeded', async () => {
            const exampleObject = { key1: 'test1'.repeat(1024), key2: 'test2'.repeat(1024) };
            const data = { collection1: [], collection: new Array(100).fill({ ...exampleObject }) };

            return await fileOperations.write(filePath, data, 0.0001)
                .catch((e) => {
                    expect(e.error).toEqual(DBTaskError.FileSizeExceeded);
                });
        });
    });
});