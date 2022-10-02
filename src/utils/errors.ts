import { DatabaseError } from '../models/enums';

export class InternalError extends Error {
    public constructor(errorName: DatabaseError, message = 'No message') {
        super(message);

        this.name = errorName;
    }
}

export class CustomError extends Error {
    public action: string;

    public constructor(errorName: DatabaseError, actionName: string, message = 'No message') {
        super(message);

        this.name = errorName;
        this.action = actionName;
    }
}
