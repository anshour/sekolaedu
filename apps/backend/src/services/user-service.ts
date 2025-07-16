import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import knex from "../database/connection";
import config from "../config";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { paginate } from "~/utils/pagination";
import emailService from "./email-service";
import { removeObjectKeys } from "~/utils/array-manipulation";
import StudentService from "./student-service";
import TeacherService from "./teacher-service";

class UserService {
  constructor() {}

  static async createUser(user: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password!);

    if (!user.role_id) {
      throw new HttpError("Role id is required", 400);
    }

    const [insertedUser] = await knex("users")
      .insert({
        ...user,
        password: hashedPassword,
      })
      .returning("id");

    const roleName = await this.getRoleNameById(user.role_id!);

    if (roleName === "student") {
      await StudentService.createFromUser(insertedUser.id);
    }

    if (roleName === "teacher") {
      await TeacherService.createFromUser(insertedUser.id);
    }

    return { id: insertedUser.id, ...user } as User;
  }

  static async getById(id: number): Promise<User | null> {
    const user = await knex("users")
      .select("id", "name", "email", "role_id", "photo_url", "is_active")
      .where({ id })
      .first();

    if (!user) {
      return null;
    }

    const roleName = await this.getRoleNameById(user.role_id);

    return {
      ...user,
      role_name: roleName,
    };
  }

  static async getByEmail(email: string): Promise<User | null> {
    const user = await knex("users")
      .select("id", "name", "email", "role_id", "password")
      .where({ email })
      .first();

    if (!user) {
      return null;
    }

    const roleName = await this.getRoleNameById(user.role_id);

    return {
      ...user,
      role_name: roleName,
    };
  }

  private static async getRoleNameById(
    roleId: number | null,
  ): Promise<string | null> {
    if (!roleId) {
      return null;
    }

    const role = await knex("roles").where({ id: roleId }).first();
    return role ? role.name : null;
  }

  static async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return !!user;
  }

  static async authenticateUser(email: string, password: string): Promise<any> {
    const user = await this.getByEmail(email);

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

  static async generateUserToken(user: User): Promise<string> {
    const data = {
      user_id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * config.jwtExpireMinutes,
    };

    const encoded = jwt.sign(data, config.jwtSecretKey, {
      algorithm: config.jwtHashAlgorithm,
    });

    return encoded;
  }

  static async generateResetToken(user: User): Promise<string> {
    const data = {
      userId: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return jwt.sign(data, config.jwtSecretKey);
  }

  static async resetPassword(
    user: User,
    password: string,
    token: string,
  ): Promise<void> {
    const reset = await knex("password_resets")
      .where({ user_id: user.id, email: user.email })
      .orderBy("created_at", "desc")
      .first();

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

    await knex("users")
      .where({ id: user.id })
      .update({ password: hashedPassword });

    await knex("password_resets").where({ id: reset.id }).delete();
  }

  static async sendResetPasswordEmail(user: User): Promise<void> {
    const token = this.generateRandomString(32);
    const resetLink = `${config.frontendUrl}/auth/reset-password?token=${token}&email=${user.email}`;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await knex("password_resets")
      .where({ email: user.email, user_id: user.id })
      .delete();

    await knex("password_resets").insert({
      user_id: user.id,
      email: user.email,
      expires_at: expiresAt,
      token: bcrypt.hashSync(token, 10),
    });

    await emailService.sendPasswordResetEmail(user.email, resetLink);
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<User>> {
    const query = knex("users")
      .join("roles", "users.role_id", "roles.id")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.is_active",
        "roles.name AS role_name",
        "roles.id AS role_id",
      ]);

    const search = params.filter?.search || "";

    if (search) {
      query.where(function () {
        this.where("users.name", "ILIKE", `%${search}%`).orWhere(
          "users.email",
          "ILIKE",
          `%${search}%`,
        );
      });
    }
    const cleanParams = removeObjectKeys(params, ["filter.search"]);

    const paginatedData = await paginate<User>(query, cleanParams, "users.id");

    return paginatedData;
  }

  static async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<User> {
    await knex("users").where({ id }).update(updateData);
    return this.getById(id) as Promise<User>;
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
    const rolebasedPermissions = await knex("role_permissions")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where({ role_id: roleId })
      .select(["permissions.name", "permissions.id"]);

    const specificPermissions = await knex("user_permissions")
      .join("permissions", "user_permissions.permission_id", "permissions.id")
      .where({ user_id: userId })
      .select(["permissions.name", "permissions.id"]);

    const uniquePermissions = new Map();

    rolebasedPermissions.forEach((permission) => {
      uniquePermissions.set(permission.id, permission.name);
    });

    specificPermissions.forEach((permission) => {
      uniquePermissions.set(permission.id, permission.name);
    });

    return Array.from(uniquePermissions.values());
  }

  static async addPermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await knex("permissions")
      .where({ id: permissionId })
      .first();

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await knex("user_permissions").insert({
      user_id: userId,
      permission_id: permission.id,
    });
  }

  static async removePermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await knex("permissions")
      .where({ id: permissionId })
      .first();

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await knex("user_permissions")
      .where({
        user_id: userId,
        permission_id: permission.id,
      })
      .delete();
  }

  static async blacklistToken(token: string, userId: number): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = jwt.verify(token, config.jwtSecretKey) as { exp: number };
      const expiresAt = new Date(decoded.exp * 1000);

      await knex("token_blacklist").insert({
        token,
        user_id: userId,
        expires_at: expiresAt,
      });
    } catch (error) {
      throw new HttpError("Invalid token", 400);
    }
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await knex("token_blacklist")
      .where({ token })
      .andWhere("expires_at", ">", new Date())
      .first();

    return !!blacklistedToken;
  }

  static async cleanupExpiredTokens(): Promise<void> {
    await knex("token_blacklist")
      .where("expires_at", "<=", new Date())
      .delete();
  }
}

export default UserService;
