import { DBMethod, DBTaskError } from '../models/enums';

export class TaskError extends Error {
    public readonly error: DBTaskError;
    public readonly details: string;

    public constructor(error: DBTaskError, message = 'No message') {
        super(message);

        this.error = error;
        this.details = message;
    }
}

export class MethodError extends Error {
    public readonly error: DBTaskError;
    public readonly method: DBMethod;
    public readonly details: string;

    public constructor(method: DBMethod, error: DBTaskError, message = 'No message') {
        super(message);

        this.method = method;
        this.error = error;
        this.details = message;
    }
}
