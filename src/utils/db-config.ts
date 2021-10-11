import DBConfiguration from '../interfaces/db-configuration';

export class DBConfig implements DBConfiguration {
    public readonly dbSize: number;
    public readonly entrySize: number;
    public readonly collectionNameMinLength: number = 4;
    public readonly collectionNameMaxLength: number = 64;

    public constructor(
        dbSize: number = 10,
        entrySize: number = 1
    ) {
        this.dbSize = dbSize;
        this.entrySize = entrySize;
    }
}
