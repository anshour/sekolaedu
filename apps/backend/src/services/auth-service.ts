import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { HttpError } from "../types/http-error";
import emailService from "./email-service";
import { Op } from "sequelize";
import UserService from "./user-service";
import {
  PasswordResetModel,
  TokenBlacklistModel,
  UserAttribute,
} from "~/models";

class AuthService {
  constructor() {}

  static async authenticateUser(email: string, password: string): Promise<any> {
    const user = await UserService.getByEmail(email, true);

    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new HttpError("Invalid email or password", 401);
    }

    console.log("User authenticated successfully");
    const permissions = await UserService.getPermissionCodes(
      user.role_id!,
      user.id,
    );
    console.log("Permissions fetched successfully");

    delete user.password;

    const userData = {
      ...user,
      permissions,
    };

    return userData;
  }

  static async generateUserToken(user: UserAttribute): Promise<string> {
    const data = {
      user_id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * config.jwtExpireMinutes,
    };

    const encoded = jwt.sign(data, config.jwtSecretKey, {
      algorithm: config.jwtHashAlgorithm,
    });

    return encoded;
  }

  static async generateResetToken(user: UserAttribute): Promise<string> {
    const data = {
      userId: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return jwt.sign(data, config.jwtSecretKey);
  }

  static async resetPassword(
    user: UserAttribute,
    password: string,
    token: string,
  ): Promise<void> {
    const reset = await PasswordResetModel.findOne({
      where: {
        user_id: user.id,
        email: user.email,
      },
      raw: true,
    });

    if (!reset) {
      throw new HttpError("Invalid or expired token", 400);
    }

    const isTokenValid = await bcrypt.compare(token, reset.token);
    if (!isTokenValid) {
      throw new HttpError("Invalid or expired token", 400);
    }
    const isTokenExpired = new Date() > reset.expires_at;

    if (isTokenExpired) {
      throw new HttpError("Invalid or expired token", 400);
    }

    const hashedPassword = await this.hashPassword(password);

    await UserService.updateUser(user.id, { password: hashedPassword });

    await PasswordResetModel.destroy({
      where: {
        id: reset.id,
      },
    });
  }

  static async sendResetPasswordEmail(user: UserAttribute): Promise<void> {
    const token = this.generateRandomString(32);
    const resetLink = `${config.frontendUrl}/auth/reset-password?token=${token}&email=${user.email}`;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await PasswordResetModel.destroy({
      where: {
        email: user.email,
        user_id: user.id,
      },
    });

    await PasswordResetModel.create({
      user_id: user.id,
      email: user.email,
      expires_at: expiresAt,
      token: await bcrypt.hash(token, 10),
    });

    await emailService.sendPasswordResetEmail(user.email, resetLink);
  }

  static async blacklistToken(token: string, userId: number): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = jwt.verify(token, config.jwtSecretKey) as { exp: number };
      const expiresAt = new Date(decoded.exp * 1000);

      await TokenBlacklistModel.create({
        token,
        user_id: userId,
        expires_at: expiresAt,
      });
    } catch (error) {
      throw new HttpError("Invalid token", 400);
    }
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await TokenBlacklistModel.findOne({
      where: {
        token,
      },
      raw: false,
    });

    return blacklistedToken !== null;
  }

  static async cleanupExpiredTokens(): Promise<void> {
    await TokenBlacklistModel.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });
  }

  private static generateRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  }

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}

export default AuthService;
