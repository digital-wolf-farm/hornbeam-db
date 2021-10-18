import DBConfiguration from '../models/db-configuration';

export class DBConfig implements DBConfiguration {
    public readonly dbSize: number;
    public readonly entrySize: number;
    public readonly collectionNameMinLength: number = 4;
    public readonly collectionNameMaxLength: number = 64;

    public constructor(
        dbSize = 10,
        entrySize = 1
    ) {
        this.dbSize = dbSize;
        this.entrySize = entrySize;
    }
}
