import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  //   await knex("role_permissions").del();
  //   await knex("user_permissions").del();
  //   await knex("roles").del();
  //   await knex("permissions").del();

  const permissionIds = await knex("permissions")
    .insert([
      { name: "action.create_users", description: "Create new users" },
      { name: "action.read_users", description: "View user data" },
      { name: "action.update_users", description: "Update user data" },
      { name: "action.delete_users", description: "Delete users" },
      { name: "action.manage_roles", description: "Manage user roles" },
      { name: "action.manage_permissions", description: "Manage permissions" },
    ])
    .returning("id")
    .onConflict("name")
    .ignore();

  // Insert roles
  const roleIds = await knex("roles")
    .insert([
      { name: "admin", readable_name: "Administrator" },
      { name: "staff", readable_name: "Staff" },
      { name: "student", readable_name: "Siswa" },
      { name: "teacher", readable_name: "Guru" },
    ])
    .returning("id")
    .onConflict("name")
    .ignore();

  // Set admin role for the admin user
  await knex("users").where({ id: 1 }).update({ role_id: roleIds[0].id });

  // Set staff role for the regular user
  await knex("users").where({ id: 2 }).update({ role_id: roleIds[1].id });

  // Associate permissions with roles
  const rolePermissions = [];

  // Admin role gets all permissions
  for (const permId of permissionIds) {
    rolePermissions.push({
      role_id: roleIds[0].id,
      permission_id: permId.id,
    });
  }

  // Staff role only gets read user permissions
  rolePermissions.push(
    { role_id: roleIds[1].id, permission_id: permissionIds[1].id }, // read_users
  );

  await knex("role_permissions").insert(rolePermissions);
}
