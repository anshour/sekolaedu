import db from "../database/connection";

class PermissionService {
  static async create(data: any) {
    const [res] = await db("permissions").insert(data).returning("id");
    return { id: res.id, ...data };
  }

  static async getById(id: number) {
    return await db("permissions").where({ id }).first();
  }

  static async update(id: number, data: any) {
    await db("permissions").where({ id }).update(data);
    return { id, ...data };
  }

  static async delete(id: number) {
    await db("permissions").where({ id }).delete();
  }

  static async getAll() {
    return await db("permissions").select("*");
  }

  static async isNameTaken(name: string): Promise<boolean> {
    const permission = await db("permissions").where({ name }).first();
    return permission !== undefined;
  }

  static async attachPermissionToUser(userId: number, permissionId: number) {
    await db("user_permissions").insert({
      user_id: userId,
      permission_id: permissionId,
    });
  }

  static async detachPermissionFromUser(userId: number, permissionId: number) {
    await db("user_permissions")
      .where({ user_id: userId, permission_id: permissionId })
      .delete();
  }

  static async detachPermissionFromRole(roleId: number, permissionId: number) {
    await db("role_permissions")
      .where({ role_id: roleId, permission_id: permissionId })
      .delete();
  }

  static async attachPermissionToRole(roleId: number, permissionId: number) {
    await db("role_permissions").insert({
      role_id: roleId,
      permission_id: permissionId,
    });
  }
}

export default PermissionService;
