import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { Role } from "~/models/role";

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

    // Get all role IDs in one array
    const roleIds = roles.data.map((role) => role.id);

    // Get all role-permission mappings in a single query
    const rolePermissions = await db("role_permissions")
      .whereIn("role_id", roleIds)
      .select(["role_id", "permission_id"]);

    // Get all unique permission IDs
    const uniquePermissionIds = [
      ...new Set(rolePermissions.map((rp) => rp.permission_id)),
    ];

    // Fetch all required permissions in a single query
    const permissions =
      uniquePermissionIds.length > 0
        ? await db("permissions")
            .whereIn("id", uniquePermissionIds)
            .select(["id", "name", "description"])
        : [];

    // Create a lookup map for permissions
    const permissionsMap = permissions.reduce(
      (map, permission) => {
        map[permission.id] = permission;
        return map;
      },
      {} as Record<number, any>,
    );

    // Map permissions to each role
    const roleWithPermissions = roles.data.map((role) => {
      const permissionIds = rolePermissions
        .filter((rp) => rp.role_id === role.id)
        .map((rp) => rp.permission_id);

      const rolePermissionDetails = permissionIds.map(
        (id) => permissionsMap[id],
      );

      return {
        ...role,
        permissions: rolePermissionDetails || [],
      };
    });

    return { ...roles, data: roleWithPermissions };
  }
}

export default RoleService;
