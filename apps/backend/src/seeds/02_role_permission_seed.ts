import { Knex } from "knex";
import { Permission } from "~/constants/permissions";
import { Role } from "~/constants/roles";

export async function seed(knex: Knex): Promise<void> {
  const permissionIds = await knex("permissions")
    .insert([
      { name: Permission.ManageRoles, description: "Manage user roles" },
      { name: Permission.ManagePermissions, description: "Manage permissions" },
      { name: Permission.ManageUsers, description: "Manage users" },
    ])
    .returning("id")
    .onConflict("name")
    .ignore();

  // Insert roles
  const roleIds = await knex("roles")
    .insert([
      { id: 1, name: Role.Admin, readable_name: "Administrator" },
      { id: 2, name: Role.Principal, readable_name: "Kepala Sekolah" },
      { id: 3, name: Role.Staff, readable_name: "Staff" },
      { id: 4, name: Role.Student, readable_name: "Siswa" },
      { id: 5, name: Role.Teacher, readable_name: "Guru" },
    ])
    .returning("id")
    .onConflict("name")
    .ignore();

  await knex.raw(
    `SELECT setval(pg_get_serial_sequence('roles', 'id'), (SELECT MAX(id) FROM roles))`,
  );

  // Set admin role for the admin user
  await knex("users").where({ id: 1 }).update({ role_id: roleIds[0].id });

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
