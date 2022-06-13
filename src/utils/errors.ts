import { DatabaseError } from '../models/enums';

export class CustomError extends Error {
    public constructor(errorName: DatabaseError, message = 'No message') {
        super(message);

        this.name = errorName;
    }
}
