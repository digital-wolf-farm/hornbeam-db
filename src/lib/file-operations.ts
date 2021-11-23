import { promises as fs } from 'fs';

import { DBData } from '../models/interfaces';
import { DBTaskError } from '../models/enums';
import { TaskError } from '../utils/errors';

async function read(path: string): Promise<DBData> {
    let fileContent: string;

    try {
        fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(e.code === 'ENOENT' ? DBTaskError.FileNotFound : DBTaskError.FileReadError, e);
    }

    return JSON.parse(fileContent);
}

async function write(path: string, data: DBData): Promise<void> {
    try {
        await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    } catch (e) {
        throw new TaskError(DBTaskError.FileWriteError, e);
    }
}

export const fileOperations = { read, write };
