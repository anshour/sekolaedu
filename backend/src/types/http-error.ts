import type { ZodIssue } from "zod";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpValidationError extends Error {
  statusCode: number;
  issues: ZodIssue[];

  constructor(issues: ZodIssue[], statusCode = 422) {
    super("Validation Error");
    this.statusCode = statusCode;
    this.issues = issues;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
