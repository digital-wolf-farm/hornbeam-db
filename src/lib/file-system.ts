import { promises as fs } from 'fs';

import { DatabaseError } from '../models/enums';
import { Database } from '../models/interfaces';
import { InternalError } from '../utils/errors';

const read = async (path: string): Promise<unknown> => {
    let fileContent: string;

    try {
        fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    } catch (e) {
        throw new InternalError(e.code === 'ENOENT' ? DatabaseError.FileNotFound : DatabaseError.FileReadError, e);
    }

    return JSON.parse(fileContent);
};

const write = async (path: string, data: Database): Promise<void> => {
    try {
        await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
    } catch (e) {
        throw new InternalError(DatabaseError.FileWriteError, e);
    }
};

export const fileSystem = { read, write };
