// TODO: Add type for non string data argument
function calculateDatabaseUsage(data: string, limit: number): string {
    let dataSize: number;

    if (typeof data !== 'string') {
        dataSize = (Buffer.byteLength(JSON.stringify(data)) / (1024 * 1024));
    } else {
        dataSize = (Buffer.byteLength(data) / (1024 * 1024));
    }

    return (dataSize / limit).toFixed(2);
}

export const helpers = {
    calculateDatabaseUsage
};
