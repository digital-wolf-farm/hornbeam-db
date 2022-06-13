import { DBConfiguration } from '../models/interfaces';

export class DBConfig implements DBConfiguration {
    public readonly dbSize: number;
    public readonly collectionNameMinLength: number = 4;
    public readonly collectionNameMaxLength: number = 64;

    public constructor(
        dbSize = 10,
    ) {
        this.dbSize = dbSize;
    }
}
