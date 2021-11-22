import { promises as fs } from 'fs';

import { DBData } from '../models/interfaces';
import { DBTaskError } from '../models/enums';
import { TaskError } from '../utils/errors';
import { helpers } from './helpers';

async function read(path: string, sizeLimit: number): Promise<DBData> {
    let fileContent: string;

    try {
        fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(e.code === 'ENOENT' ? DBTaskError.FileNotFound : DBTaskError.FileReadError, e);
    }

    const dbUsage = helpers.calculateDatabaseUsage(fileContent, sizeLimit);
    
    if (parseFloat(dbUsage) >= 100) {
        throw new TaskError(DBTaskError.FileSizeExceeded, `DB usage - ${dbUsage}%`);
    }

    return JSON.parse(fileContent);
}

async function write(path: string, data: DBData, sizeLimit: number): Promise<void> {
    const dbUsage = helpers.calculateDatabaseUsage(data, sizeLimit);
    
    if (parseFloat(dbUsage) >= 100) {
        throw new TaskError(DBTaskError.DatabaseSizeExceeded, `DB usage - ${dbUsage}%`);
    }

    try {
        await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    } catch (e) {
        console.log('------ e ------', e);
        throw new TaskError(DBTaskError.FileWriteError, e);
    }
}

export const fileOperations = { read, write };
