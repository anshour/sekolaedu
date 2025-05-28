import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import knex from "../database/connection";
import config from "../config";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { paginate } from "~/utils/pagination";
import { attachBelongsTo } from "~/utils/attach-relation";
import { Role } from "~/models/role";

class UserService {
  constructor() {}

  static async createUser(user: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password!);

    const [insertedUser] = await knex("users")
      .insert({
        ...user,
        password: hashedPassword,
      })
      .returning("id");

    return { id: insertedUser.id, ...user } as User;
  }

  static async getById(id: number): Promise<User | null> {
    const user = await knex("users")
      .select("id", "name", "email", "role_id")
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

    //TODO: SEND EMAIL
    // const resend = new Resend(config.resendKey);

    // const res = await resend.emails.send({
    //   from: "Resend Dev <onboarding@resend.dev>",
    //   to: user.email,
    //   subject: "Reset Password Request",
    //   react: ResetPasswordEmail({ resetLink }),
    // });

    // if (res.error !== null) {
    //   logger.error(res.error);
    //   throw new HttpError("Error sending email", 500);
    // }
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<User>> {
    const query = knex("users")
      .join("roles", "users.role_id", "roles.id")
      .select(["users.*", "roles.name AS role_name", "roles.id AS role_id"]);

    const paginatedData = await paginate<User>(query, params, "users.id");

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
}

export default UserService;
