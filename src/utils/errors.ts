import { DBMethod } from '../enums/db-method';
import { DBTaskError } from '../enums/db-task-error';

export class TaskError extends Error {
    public readonly error: DBTaskError;

    public constructor(error: DBTaskError, message: string = 'No message') {
        super(message);

        this.error = error;
    }

    // TODO: Verify if toString() method is required here
}

export class MethodError extends Error {
    public readonly error: DBTaskError;
    public readonly method: DBMethod;

    public constructor(method: DBMethod, error: DBTaskError, message: string = 'No message') {
        super(message);

        this.error = error;
        this.method = method;
    }

    // TODO: Verify if toString() method is required here
}
