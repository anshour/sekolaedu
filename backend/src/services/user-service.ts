import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import config from "../config";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import emailService from "./email-service";
import db from "../database/connection";
import {
  passwordResets,
  roles,
  userPermissions,
  users,
} from "~/database/schema";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { paginate } from "~/utils/pagination";

class UserService {
  constructor() {}

  static async createUser(user: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password!);

    const defaultRoleId = 2; // STAFF
    const [insertedUser] = await db
      .insert(users)
      .values({
        name: user.name!,
        email: user.email!,
        role_id: user.role_id || defaultRoleId,
        is_active: user.is_active ?? true,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    return { id: insertedUser.id, ...user } as User;
  }

  static async getById(id: number): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.id, id),
      with: {
        role: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const roleName = await this.getRoleNameById(user.role_id);

    console.log("User found:", user);

    return {
      ...user,
      role_name: roleName,
    };
  }

  static async getByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.email, email),
      with: {
        role: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

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

    const role = await db.query.roles.findFirst({
      where: (roles) => eq(roles.id, roleId),
    });

    return role ? role.name : null;
  }

  static async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return !!user;
  }

  static async authenticateUser(email: string, password: string): Promise<any> {
    const user = await this.getByEmail(email);

    console.log("User found:", user);

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
    const reset = await db.query.passwordResets.findFirst({
      where: (password_resets) =>
        eq(password_resets.user_id, user.id) &&
        eq(password_resets.email, user.email),
      orderBy: (password_resets) => password_resets.created_at,
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

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, user.id));

    await db.delete(passwordResets).where(eq(passwordResets.id, reset.id));
  }

  static async sendResetPasswordEmail(user: User): Promise<void> {
    const token = this.generateRandomString(32);
    const resetLink = `${config.frontendUrl}/auth/reset-password?token=${token}&email=${user.email}`;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await db
      .delete(passwordResets)
      .where(
        and(
          eq(passwordResets.email, user.email),
          eq(passwordResets.user_id, user.id),
        ),
      );

    await db.insert(passwordResets).values({
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
    const search = params.filter?.search || "%";

    return paginate<User>(params, {
      table: users,
      where: (users) =>
        or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
      with: {
        role: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: (users) =>
        Object.keys(params.sort || {}).map((key) => {
          const direction = params.sort![key] === "desc" ? "desc" : "asc";

          if (key === "role_name") {
            if (direction === "desc") {
              return desc(roles.name);
            }
            if (direction === "asc") {
              return asc(roles.name);
            }
          }

          if (direction === "desc") {
            return desc(users[key as keyof User]);
          }

          if (direction === "asc") {
            return asc(users[key as keyof User]);
          }
        }),
    });
    // const page = params.page || 1;
    // const limit = params.limit || 15;
    // const offset = (page - 1) * limit;
    // const search = params.filter?.search || "%";

    // // Count total users matching the filter
    // const total = await db
    //   .select({ count: count(), name: users.name, email: users.email })
    //   .from(users)
    //   .groupBy(users.id)
    //   .where((users) =>
    //     or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
    //   )
    //   .then((result) => Number(result[0]?.count) || 0);

    // // Fetch paginated users
    // const data = await db.query.users.findMany({
    //   where: (users) =>
    //     or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
    //   with: {
    //     role: true,
    //   },
    //   orderBy: (users) => users.name,
    //   limit,
    //   offset,
    // });

    // const last_page = Math.ceil(total / limit);

    // return {
    //   data,
    //   total,
    //   current_page: page,
    //   last_page,
    //   limit,
    // };
  }

  static async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<User> {
    await db
      .update(users)
      .set({
        name: updateData.name,
        email: updateData.email,
        is_active: updateData.is_active,
      })
      .where(eq(users.id, id));
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
    const rolebasedPermissions = await db.query.rolePermissions.findMany({
      where: (tables) => (roleId ? eq(tables.role_id, roleId) : undefined),
      with: {
        permission: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    const specificPermissions = await db.query.userPermissions.findMany({
      where: (user_permissions) => eq(user_permissions.user_id, userId),
      with: {
        permission: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    const uniquePermissions = new Map();

    rolebasedPermissions.forEach((permission) => {
      uniquePermissions.set(permission.id, permission.permission.name);
    });

    specificPermissions.forEach((permission) => {
      uniquePermissions.set(permission.id, permission.permission.name);
    });

    return Array.from(uniquePermissions.values());
  }

  static async addPermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await db.query.permissions.findFirst({
      where: (permissions) => eq(permissions.id, permissionId),
    });

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await db.insert(userPermissions).values({
      user_id: userId,
      permission_id: permission.id,
    });
  }

  static async removePermission(
    userId: number,
    permissionId: number,
  ): Promise<void> {
    const permission = await db.query.permissions.findFirst({
      where: (permissions) => eq(permissions.id, permissionId),
    });

    if (!permission) {
      throw new HttpError(
        `Permission with id '${permissionId}' not found`,
        400,
      );
    }

    await db
      .delete(userPermissions)
      .where(
        and(
          eq(userPermissions.user_id, userId),
          eq(userPermissions.permission_id, permission.id),
        ),
      );
  }
}

export default UserService;
