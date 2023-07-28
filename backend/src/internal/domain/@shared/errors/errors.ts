export class ErrorResponse extends Error {
    private _code: number;

    constructor(message: string, code: number) {
        super(message);
        this._code = code;
    }

    get code(): number {
        return this._code;
    }
}

export class DatabaseGenericError extends ErrorResponse {

}

export class NotFoundError extends ErrorResponse {
    private _context: string;

    constructor(message: string, code: number, context: string) {
        super(message, code);
        this._context = context;
    }

    get context(): string {
        return this._context;
    }
}

export class ConstraintValidationError extends ErrorResponse {
    private _context: string;
    private _constraints: string[];

    constructor(message: string, code: number, context: string, constraints: string[]) {
        super(message, code);
        this._context = context;
        this._constraints = constraints;
    }

    get context(): string {
        return this._context;
    }

    get constrains(): string[] {
        return this._constraints;
    }
}