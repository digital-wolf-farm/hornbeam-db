import { promises as fs } from 'fs';

import { BDTaskError } from '../enums/db-task-error';
import { TaskError } from '../utils/errors';

async function readDbFile(path) {
    try {
        return await fs.readFile(path, { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(e.code === 'ENOENT' ? BDTaskError.fileNotFound : BDTaskError.fileReadError, e);
    }
}

async function writeDbFile(path, data) {
    try {
        const pathArray = path.split('/');

        for (const [index, value] of pathArray.entries()) {
            if (value !== '.' && value !== '..' && !value.includes('.json')) {
                const subPath = pathArray.slice(0, index + 1).join('/');
                await fs.mkdir(subPath, { recursive: true });
            }
        }
    } catch (e) {
        throw new TaskError(BDTaskError.directoryCreateError, e);
    }

    try {
        await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(BDTaskError.fileWriteError, e);
    }
}

export const files = {
    readDbFile,
    writeDbFile
}
