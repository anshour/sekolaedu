import bcrypt from "bcryptjs";
import { HttpError } from "../types/http-error";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import StudentService from "./student-service";
import TeacherService from "./teacher-service";
import { CreationAttributes, Op } from "sequelize";
import buildWhereQuery from "~/utils/query/build-where-query";
import buildOrderQuery from "~/utils/query/build-order-query";
import RoleService from "./role-service";
import {
  PermissionableModel,
  PermissionModel,
  RoleModel,
  UserAttribute,
  UserModel,
} from "~/models";

class UserService {
  constructor() {}

  static async createUser(
    userData: CreationAttributes<UserModel>,
  ): Promise<UserAttribute> {
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

    const roleCode = await RoleService.getRoleCodeById(createdUser.role_id!);

    if (roleCode === "student") {
      await StudentService.createFromUser(createdUser.id);
    }

    if (roleCode === "teacher") {
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
        attributes: ["id", "label"],
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
        attributes: ["id", "label"],
      },
    });

    return user;
  }

  static async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return !!user;
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

  static async getPermissionCodes(
    roleId: number,
    userId: number,
  ): Promise<string[]> {
    const rolebasedPermissions = await PermissionableModel.findAll({
      where: { permission_id: roleId, permissionable_type: "role" },
      include: [
        {
          model: PermissionModel,
          as: "permission",
          attributes: ["id", "code"],
        },
      ],
      attributes: [],
      raw: true,
      nest: true,
    });

    // Get user-specific permissions using Sequelize
    const specificPermissions = await PermissionableModel.findAll({
      where: { permissionable_id: userId, permissionable_type: "user" },
      include: [
        {
          model: PermissionModel,
          as: "permission",
          attributes: ["id", "code"],
        },
      ],
      attributes: [],
      raw: true,
      nest: true,
    });

    const uniquePermissions = new Map();

    rolebasedPermissions.forEach((item: any) => {
      uniquePermissions.set(item.permission.id, item.permission.code);
    });

    specificPermissions.forEach((item: any) => {
      uniquePermissions.set(item.permission.id, item.permission.code);
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

    await PermissionableModel.create({
      permissionable_id: userId,
      permission_id: permission.id,
      permissionable_type: "user",
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

    await PermissionableModel.destroy({
      where: {
        permissionable_id: userId,
        permission_id: permission.id,
        permissionable_type: "user",
      },
    });
  }
}

export default UserService;
