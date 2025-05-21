import type { Request, Response, NextFunction } from "express";
import { HttpError } from "~/types/http-error";

const authorizePermission = (permissions: string | string[]) => {
  const permissionArray = Array.isArray(permissions)
    ? permissions
    : [permissions];

  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.user?.permissions?.some((perm) => permissionArray.includes(perm))
    ) {
      throw new HttpError(
        "You do not have permission to perform this action",
        403,
      );
    }
    next();
  };
};

export default authorizePermission;
