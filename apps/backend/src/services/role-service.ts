import { RoleModel } from "~/models";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { CreationAttributes } from "sequelize";

class RoleService {
  static async create(data: CreationAttributes<RoleModel>) {
    return RoleModel.create(data, { raw: true });
  }

  static async getById(id: number) {
    const role = await RoleModel.findByPk(id, {
      raw: true,
      include: ["permissions"],
    });

    return role;
  }

  static async getRoleCodeById(id: number): Promise<string | null> {
    const role = await RoleModel.findOne({
      where: {
        id,
      },
      raw: true,
    });

    return role?.code || "";
  }

  static async isCodeTaken(code: string): Promise<boolean> {
    const role = await RoleModel.findOne({
      where: {
        code,
      },
      raw: true,
    });
    return role !== null;
  }

  static async update(
    id: number,
    data: Partial<CreationAttributes<RoleModel>>,
  ) {
    await RoleModel.update(data, {
      where: {
        id,
      },
    });
    return { id, ...data };
  }

  static async delete(id: number) {
    await RoleModel.destroy({
      where: {
        id,
      },
    });
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<RoleModel>> {
    const data = await RoleModel.paginate({
      page: params.page,
      limit: params.limit,
      order: [["created_at", "DESC"]],
    });

    return data;
  }
}

export default RoleService;
