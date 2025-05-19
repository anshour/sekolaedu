import db from "../database/connection";

class PermissionService {
  static async create(data: any) {
    const [permissionId] = await db("permissions").insert(data).returning("id");
    return { id: permissionId, ...data };
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

  static async addPermissionToUser(userId: number, permissionId: number) {
    await db("user_permissions").insert({
      user_id: userId,
      permission_id: permissionId,
    });
  }

  static async deletePermissionFromUser(userId: number, permissionId: number) {
    await db("user_permissions")
      .where({ user_id: userId, permission_id: permissionId })
      .delete();
  }
}

export default PermissionService;
