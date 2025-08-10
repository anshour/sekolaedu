import { PaginationParams, PaginationResult } from "~/types/pagination";
import { CreationAttributes } from "sequelize";
import { PermissionableModel, PermissionModel } from "~/models";

class PermissionService {
  static async create(data: CreationAttributes<PermissionModel>) {
    return PermissionModel.create(data, { raw: true });
  }

  static async getById(id: number) {
    return await PermissionModel.findByPk(id, { raw: true });
  }

  static async update(
    id: number,
    data: Partial<CreationAttributes<PermissionModel>>,
  ) {
    await PermissionModel.update(data, { where: { id } });
    return { id, ...data };
  }

  static async delete(id: number) {
    await PermissionModel.destroy({ where: { id } });
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<PermissionModel>> {
    return PermissionModel.paginate({
      page: params.page,
      limit: params.limit,
      order: [["created_at", "DESC"]],
    });
  }

  static async isCodeTaken(code: string): Promise<boolean> {
    const permission = await PermissionModel.findOne({ where: { code } });
    return permission !== null;
  }

  static async attachPermissionToUser(userId: number, permissionId: number) {
    await PermissionableModel.create({
      permission_id: permissionId,
      permissionable_id: userId,
      permissionable_type: "user",
    });
  }

  static async detachPermissionFromUser(userId: number, permissionId: number) {
    await PermissionableModel.destroy({
      where: {
        permissionable_id: userId,
        permissionable_type: "user",
        permission_id: permissionId,
      },
    });
  }

  static async detachPermissionFromRole(roleId: number, permissionId: number) {
    await PermissionableModel.destroy({
      where: {
        permissionable_id: roleId,
        permissionable_type: "role",
        permission_id: permissionId,
      },
    });
  }

  static async attachPermissionToRole(roleId: number, permissionId: number) {
    await PermissionableModel.create({
      permissionable_id: roleId,
      permissionable_type: "role",
      permission_id: permissionId,
    });
  }
}

export default PermissionService;
