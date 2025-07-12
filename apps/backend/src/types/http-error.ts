import type { ZodIssue } from "zod/v4";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpValidationError extends HttpError {
  issues: ZodIssue[];

  constructor(issues: ZodIssue[], statusCode = 422) {
    super("Validation Error", statusCode);
    this.issues = issues;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
