import { users, roles, permissions, rolePermissions } from "../database/schema";
import bcrypt from "bcryptjs";
import db from "./connection";
import { eq } from "drizzle-orm";

export async function insertSeedData() {
  try {
    // Hash password for users
    const hashedPassword = await bcrypt.hash("password", 10);

    // Insert users
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
          isActive: true,
        },
        {
          name: "Regular User",
          email: "user@example.com",
          password: hashedPassword,
          isActive: true,
        },
      ])
      .onConflictDoNothing()
      .returning();

    // Insert permissions
    const insertedPermissions = await db
      .insert(permissions)
      .values([
        { name: "create_users", description: "Create new users" },
        { name: "read_users", description: "View user data" },
        { name: "update_users", description: "Update user data" },
        { name: "delete_users", description: "Delete users" },
        { name: "manage_roles", description: "Manage user roles" },
        { name: "manage_permissions", description: "Manage permissions" },
      ])
      .onConflictDoNothing()
      .returning();

    // Insert roles
    const insertedRoles = await db
      .insert(roles)
      .values([
        { name: "admin", readableName: "Administrator" },
        { name: "staff", readableName: "Staff Member" },
      ])
      .onConflictDoNothing()
      .returning();

    // Update users with role assignments
    if (insertedUsers.length > 0 && insertedRoles.length > 0) {
      // Set admin role for the admin user
      await db
        .update(users)
        .set({ roleId: insertedRoles[0].id })
        .where(eq(users.email, "admin@example.com"));

      // Set staff role for the regular user
      await db
        .update(users)
        .set({ roleId: insertedRoles[1].id })
        .where(eq(users.email, "user@example.com"));
    }

    // Associate permissions with roles
    if (insertedRoles.length > 0 && insertedPermissions.length > 0) {
      const rolePermissionData = [];

      // Admin role gets all permissions
      for (const permission of insertedPermissions) {
        rolePermissionData.push({
          roleId: insertedRoles[0].id,
          permissionId: permission.id,
        });
      }

      // Staff role only gets read user permissions
      const readUsersPermission = insertedPermissions.find(
        (p) => p.name === "read_users",
      );
      if (readUsersPermission) {
        rolePermissionData.push({
          roleId: insertedRoles[1].id,
          permissionId: readUsersPermission.id,
        });
      }

      await db
        .insert(rolePermissions)
        .values(rolePermissionData)
        .onConflictDoNothing();
    }

    console.log("Seed data inserted successfully");
    return {
      users: insertedUsers,
      roles: insertedRoles,
      permissions: insertedPermissions,
    };
  } catch (error) {
    console.error("Error inserting seed data:", error);
    throw error;
  }
}
