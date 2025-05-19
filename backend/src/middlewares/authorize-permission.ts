import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../types/http-error";

const authorizePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions?.includes(permission)) {
      throw new HttpError(
        "You do not have permission to perform this action",
        403,
      );
    }
    next();
  };
};

export default authorizePermission;
