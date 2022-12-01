import { DatabaseError } from '../models/enums';

export class InternalError extends Error {
    public constructor(errorName: DatabaseError, message = 'No message') {
        super(message);

        this.name = errorName;
    }
}

export class HornbeamError extends Error {
    public constructor(errorName: DatabaseError, actionName: string, message = 'No message') {
        super(`Action: ${actionName}, error: ${errorName}, details: ${message}`);

        this.name = errorName;
    }
}
