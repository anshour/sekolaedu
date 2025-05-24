import type { NextFunction, Request, Response } from "express";
import { HttpError, HttpValidationError } from "~/types/http-error";
import logger from "./logger";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    message: "Error 404 not found",
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof HttpValidationError) {
    res.status(err.statusCode).json({
      message: "Validation Error",
      status_code: err.statusCode,
      issues: err.issues,
    });
    return;
  }

  if (err instanceof HttpError) {
    if (err.statusCode === 500) {
      logger.error({ message: err.message, stack: err.stack });
    }

    res.status(err.statusCode).json({
      message: err.message,
      status_code: err.statusCode,
    });
    return;
  }

  // Catches JSON parsing errors
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    res.status(400).json({
      message: "Invalid JSON format",
      status_code: 400,
    });
    return;
  }

  logger.error({ message: err.message, stack: err.stack });
  res.status(500).json({
    message: "Internal Server Error",
    status_code: 500,
  });
};
