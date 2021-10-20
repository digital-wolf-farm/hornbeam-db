import { filters } from './filters';

function calculateDatabaseUsage(data: string | object, limit: number): string {
    let dataSize: number;

    if (typeof data !== 'string') {
        dataSize = (Buffer.byteLength(JSON.stringify(data)) / (1024 * 1024));
    } else {
        dataSize = (Buffer.byteLength(data) / (1024 * 1024));
    }

    return (dataSize / limit).toFixed(2);
}

function findEntryId(collection: Object[], queryList: any[]): number {
    return collection.findIndex((entry) => queryList.every((query) => filters[query.type](entry[query.field], query.value)));
} 

export const helpers = {
    calculateDatabaseUsage,
    findEntryId
};
