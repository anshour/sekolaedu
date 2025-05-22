import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { Role } from "~/models/role";
import { attachManyToMany } from "~/utils/attach-relation";

class RoleService {
  static async create(data: any) {
    const [res] = await db("roles").insert(data).returning("id");
    return { id: res[0].id, ...data };
  }

  static async getById(id: number) {
    return await db("roles").where({ id }).first();
  }

  static async update(id: number, data: any) {
    await db("roles").where({ id }).update(data);
    return { id, ...data };
  }

  static async delete(id: number) {
    await db("roles").where({ id }).delete();
  }

  static async getAll() {
    const query = db("roles").select("*");

    const roles = await paginate<Role>(query, {
      page: 1,
      limit: 10,
    });

    const rolesWithPermissions = await attachManyToMany(roles.data, {
      parentIdKey: "id",
      relationTable: "role_permissions",
      parentForeignKey: "role_id",
      relatedForeignKey: "permission_id",
      relatedTable: "permissions",
      relatedFields: ["id", "name", "description"],
      outputKey: "permissions",
    });

    return { ...roles, data: rolesWithPermissions };
  }
}

export default RoleService;
