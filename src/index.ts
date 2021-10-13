import { Buffer } from 'buffer';

import { DBConfig } from './utils/db-config';
import { DB } from './interfaces/db';
import { filters } from './lib/filters';
import { DBMethod } from './enums/db-method';
import { DBTaskError } from './enums/db-task-error';
import { MethodError, TaskError } from './utils/errors';
import { Entry } from './interfaces/entry';
import { files } from './lib/files';

export default DBConfig;

export function hornbeamDB(configuration: DBConfig) {

    let database: DB;
    let databaseFilePath: string;
    let config: DBConfig;

    if (configuration instanceof DBConfig) {
        config = configuration;
    } else {
        config = new DBConfig();
    }

    function add(collection: string, data: Entry, options: any): void { }
    function find(collection: string, filters: any[], options: any): Entry[] { return []; }
    function replace(collection: string, filters: any[], data: Entry): void { }
    function remove(collection: string, filters: any[]): void { }

    async function open(path: string): Promise<void> {
        databaseFilePath = path;

        if (database) {
            database = undefined;
        }

        try {
            // TODO: Verify path argument
            database = await files.read(path, config.dbSize);
        } catch (e) {
            // TODO: Clear db cache

            throw new MethodError(DBMethod.OpenDB, e.error, e.message);
        }
    }

    async function save(): Promise<void> { }
    function close(): void { }
    async function stat(): Promise<any> { }

    return {
        add,
        find,
        replace,
        remove,
        open,
        save,
        close,
        stat
    };
}
