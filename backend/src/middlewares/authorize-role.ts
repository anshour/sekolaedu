import type { Request, Response, NextFunction } from "express";
import { HttpError } from "~/types/http-error";

function authorizeRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user!;

    if (!roleArray.includes(user.role)) {
      throw new HttpError(`Required roles: ${roleArray.join(", ")}`, 403);
    }

    next();
  };
}

export default authorizeRole;
