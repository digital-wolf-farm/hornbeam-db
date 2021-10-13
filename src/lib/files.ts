import { promises as fs } from 'fs';

import { DB } from '../interfaces/db';
import { DBTaskError } from '../enums/db-task-error';
import { TaskError } from '../utils/errors';
import { helpers } from './helpers';
import { verifiers } from './verifiers';

async function read(path: string, sizeLimit: number): Promise<DB> {
    let fileContent: string;

    try {
        fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(e.code === 'ENOENT' ? DBTaskError.FileNotFound : DBTaskError.FileReadError, e);
    }

    if (parseFloat(helpers.calculateDatabaseUsage(fileContent, sizeLimit)) >= 100) {
        // TODO: Pass db usage as error message
        throw new TaskError(DBTaskError.FileSizeExceeded);
    }

    const parsedContent = JSON.parse(fileContent);

    if (!verifiers.isFileContentValid(parsedContent)) {
        // TODO: Pass detailed info as error message
        throw new TaskError(DBTaskError.FileContentFormatMismatch);
    }

    return parsedContent;
}

async function write(path: string, data: DB, sizeLimit: number): Promise<void> {
    // try {
    //     const pathArray = path.split('/');

    //     for (const [index, value] of pathArray.entries()) {
    //         if (value !== '.' && value !== '..' && !value.includes('.json')) {
    //             const subPath = pathArray.slice(0, index + 1).join('/');
    //             await fs.mkdir(subPath, { recursive: true });
    //         }
    //     }
    // } catch (e) {
    //     throw new TaskError(DBTaskError.directoryCreateError, e);
    // }

    // try {
    //     await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    // } catch (e) {
    //     throw new TaskError(DBTaskError.fileWriteError, e);
    // }
}

export const files = { read, write };
