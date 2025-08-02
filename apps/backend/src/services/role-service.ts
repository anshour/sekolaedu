import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { RoleAttribute, RoleModel } from "~/models/role";
import { attachManyToMany } from "~/utils/attach-relation";
import { PaginationParams, PaginationResult } from "~/types/pagination";

class RoleService {
  static async create(data: any) {
    const [res] = await db("roles").insert(data).returning("id");

    console.log("Role created with ID:", res);
    return { id: res.id, ...data };
  }

  static async getById(id: number) {
    const role = await db("roles").where({ id }).first();

    const [roleWithPermissions] = await attachManyToMany([role], {
      parentIdKey: "id",
      relationTable: "role_permissions",
      parentForeignKey: "role_id",
      relatedForeignKey: "permission_id",
      relatedTable: "permissions",
      relatedFields: ["id", "name", "description"],
      outputKey: "permissions",
    });

    return roleWithPermissions;
  }

  static async getRoleNameById(id: number): Promise<string | null> {
    const role = await RoleModel.findOne({
      where: {
        id,
      },
      raw: true,
    });

    return role?.name || "";
  }

  static async isNameTaken(name: string): Promise<boolean> {
    const role = await db("roles").where({ name }).first();
    return role !== undefined;
  }

  static async update(id: number, data: any) {
    await db("roles").where({ id }).update(data);
    return { id, ...data };
  }

  static async delete(id: number) {
    await db("roles").where({ id }).delete();
  }

  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<RoleAttribute>> {
    const query = db("roles").select("*");

    const data = await paginate<RoleAttribute>(query, params);

    return data;
  }
}

export default RoleService;
