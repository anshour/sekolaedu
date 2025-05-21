import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  //   await knex("role_permissions").del();
  //   await knex("user_permissions").del();
  //   await knex("roles").del();
  //   await knex("permissions").del();

  const permissionIds = await knex("permissions")
    .insert([
      { name: "create_users", description: "Create new users" },
      { name: "read_users", description: "View user data" },
      { name: "update_users", description: "Update user data" },
      { name: "delete_users", description: "Delete users" },
      { name: "manage_roles", description: "Manage user roles" },
      { name: "manage_permissions", description: "Manage permissions" },
    ])
    .returning("id")
    .onConflict("name")
    .ignore();

  // Insert roles
  const roleIds = await knex("roles")
    .insert([{ name: "admin" }, { name: "staff" }])
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
