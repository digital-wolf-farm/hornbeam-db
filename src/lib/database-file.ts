import { promises as fs } from 'fs';

import { DB } from '../interfaces/db';
import { DBTaskError } from '../enums/db-task-error';
import { TaskError } from '../utils/errors';
import { helpers } from './helpers';

async function read(path: string, sizeLimit: number): Promise<DB> {
    let fileContent: string;

    try {
        fileContent = await fs.readFile(path + '.json', { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(e.code === 'ENOENT' ? DBTaskError.FileNotFound : DBTaskError.FileReadError, e);
    }

    const dbUsage = helpers.calculateDatabaseUsage(fileContent, sizeLimit);
    
    if (parseFloat(dbUsage) >= 100) {
        throw new TaskError(DBTaskError.FileSizeExceeded, `DB usage - ${dbUsage}%`);
    }

    return JSON.parse(fileContent);
}

async function write(path: string, data: DB, sizeLimit: number): Promise<void> {
    const dbUsage = helpers.calculateDatabaseUsage(data, sizeLimit);
    
    if (parseFloat(dbUsage) >= 100) {
        throw new TaskError(DBTaskError.FileSizeExceeded, `DB usage - ${dbUsage}%`);
    }

    try {
        await fs.writeFile(path + '.json', JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(DBTaskError.FileWriteError, e);
    }
}

export const databaseFile = { read, write };
