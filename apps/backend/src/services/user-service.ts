import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserAttribute, UserModel } from "../models/user";
import knex from "../database/connection";
import config from "../config";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import emailService from "./email-service";
import StudentService from "./student-service";
import TeacherService from "./teacher-service";
import { Op } from "sequelize";
import buildWhereQuery from "~/utils/query/build-where-query";
import buildOrderQuery from "~/utils/query/build-order-query";
import { RoleModel } from "~/models/role";
import RoleService from "./role-service";
import { PasswordResetModel } from "~/models/password_resets";
import { TokenBlacklistModel } from "~/models/token_blacklist";
import { PermissionModel } from "~/models/permission";

class UserService {
  constructor() {}

  static async createUser(userData: UserAttribute): Promise<UserAttribute> {
    const hashedPassword = await this.hashPassword(userData.password!);

    if (!userData.role_id) {
      throw new HttpError("Role id is required", 400);
    }

    const createdUser = (await UserModel.create(
      {
        ...userData,
        password: hashedPassword,
      },
      {
        raw: true,
      },
    )) as UserAttribute;

    const roleName = await RoleService.getRoleNameById(createdUser.role_id!);

    if (roleName === "student") {
      await StudentService.createFromUser(createdUser.id);
    }

    if (roleName === "teacher") {
      await TeacherService.createFromUser(createdUser.id);
    }

    delete createdUser.password;

    return createdUser;
  }

  static async getById(id: number): Promise<UserAttribute | null> {
    const user = await UserModel.findOne({
      where: {
        id,
      },
      raw: true,
      nest: true,
      include: {
        model: RoleModel,
        as: "role",
        attributes: ["id", "name"],
      },
    });

    return user;
  }

  static async getByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserModel | null> {
    const UserModelScoped = withPassword
      ? UserModel.scope("withPassword")
      : UserModel;

    const user = await UserModelScoped.findOne({
      where: {
        email,
      },
      raw: true,
      nest: true,
      include: {
        model: RoleModel,
        as: "role",
        attributes: ["id", "name"],
      },
    });

    return user;
  }

  static async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return !!user;
  }

  static async authenticateUser(email: string, password: string): Promise<any> {
    const user = await this.getByEmail(email, true);

    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new HttpError("Invalid email or password", 401);
    }

    const permissions = await this.getPermissions(user.role_id, user.id);

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

    await UserModel.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: user.id,
        },
      },
    );

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

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<UserModel>> {
    const whereQuery = buildWhereQuery(params.filter, {
      search: (value) => ({
        [Op.or]: [
          { name: { [Op.iLike]: `%${value}%` } },
          { email: { [Op.iLike]: `%${value}%` } },
        ],
      }),
      name: (value) => ({ [Op.iLike]: `%${value}%` }),
      email: (value) => ({ [Op.iLike]: `%${value}%` }),
      is_active: (value) => value === "true" || value === true,
    });

    const orderQuery = buildOrderQuery(params.sort);

    const paginatedUsers = await UserModel.paginate({
      page: params.page,
      limit: params.limit,
      where: whereQuery,
      order: orderQuery,
    });

    return paginatedUsers;
  }

  static async updateUser(
    id: number,
    updateData: Partial<UserAttribute>,
  ): Promise<UserAttribute> {
    await UserModel.update(updateData, {
      where: {
        id,
      },
    });

    const user = await this.getById(id);

    return user!;
  }

  private static generateRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  }

  static generateDefaultPassword(length: number = 8): string {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    const allChars = lowercase + uppercase + numbers + symbols;

    // Ensure at least one character from each category
    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async getPermissions(
    roleId: number | null,
    userId: number,
  ): Promise<string[]> {
    // Get role-based permissions using Sequelize
    const rolebasedPermissions = await RolePermissionModel.findAll({
      where: { role_id: roleId },
      include: [
        {
          model: PermissionModel,
          as: "permission",
          attributes: ["id", "name"],
        },
      ],
      attributes: [],
      raw: true,
      nest: true,
    });

    // Get user-specific permissions using Sequelize
    const specificPermissions = await UserPermissionModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PermissionModel,
          as: "permission",
          attributes: ["id", "name"],
        },
      ],
      attributes: [],
      raw: true,
      nest: true,
    });

    const uniquePermissions = new Map();

    rolebasedPermissions.forEach((item: any) => {
      uniquePermissions.set(item.permission.id, item.permission.name);
    });

    specificPermissions.forEach((item: any) => {
      uniquePermissions.set(item.permission.id, item.permission.name);
    });

    return Array.from(uniquePermissions.values());
  }

  static async addPermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await PermissionModel.findOne({
      where: { id: permissionId },
      raw: true,
    });

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await UserPermissionModel.create({
      user_id: userId,
      permission_id: permission.id,
    });
  }

  static async removePermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await PermissionModel.findOne({
      where: { id: permissionId },
      raw: true,
    });

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await UserPermissionModel.destroy({
      where: {
        user_id: userId,
        permission_id: permission.id,
      },
    });
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
}

export default UserService;
