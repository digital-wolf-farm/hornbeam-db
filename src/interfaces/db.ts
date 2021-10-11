import { Entry } from './entry';

export interface DB {
    [collectionName: string]: Entry[];
}
