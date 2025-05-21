import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "~/config";
import UserService from "~/services/user";
import { HttpError } from "~/types/http-error";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new HttpError("Access denied. No token provided.", 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecretKey) as {
      user_id: number;
    };

    const user = await UserService.getById(decoded.user_id);
    if (!user) {
      throw new HttpError("Invalid user", 401);
    }

    const permissions = await UserService.getPermissions(
      user.role_id,
      user.id,
    );

    Object.assign(req, { user: { ...user, permissions } });

    next();
  } catch (error) {
    throw new HttpError("Invalid or expired token", 401);
  }
}

export default authenticate;
