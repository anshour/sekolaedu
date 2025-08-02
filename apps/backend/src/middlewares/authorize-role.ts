import type { Request, Response, NextFunction } from "express";
import { UserAttribute } from "~/models/user";
import { HttpError } from "~/types/http-error";

function authorizeRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user! as UserAttribute;

    // @ts-expect-error because user.role is not explicitly defined in UserAttribute
    if (!user.role?.name) {
      throw new HttpError("User has no role assigned", 403);
    }

    // @ts-expect-error
    if (!roleArray.includes(user?.role?.name)) {
      throw new HttpError(`Required roles: ${roleArray.join(", ")}`, 403);
    }

    next();
  };
}

export default authorizeRole;
