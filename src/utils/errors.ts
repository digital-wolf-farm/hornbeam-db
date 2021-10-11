import { DBMethod } from '../enums/db-method';
import { BDTaskError } from '../enums/db-task-error';

export class TaskError extends Error {
    public readonly error: BDTaskError;

    public constructor(error: BDTaskError, message: string = 'No message') {
        super(message);

        this.error = error;
    }

    // TODO: Verify if toString() method is required here
}

export class MethodError extends Error {
    public readonly error: BDTaskError;
    public readonly method: DBMethod;

    public constructor(method: DBMethod, error: BDTaskError, message: string = 'No message') {
        super(message);

        this.error = error;
        this.method = method;
    }

    // TODO: Verify if toString() method is required here
}
