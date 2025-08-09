"use strict";

import { QueryInterface, DataTypes, Op } from "sequelize";
import { Permission } from "~/constants/permissions";
import { Role } from "~/constants/roles";

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("permissions", [
      {
        label: "Manage Users",
        code: Permission.ManageUsers,
        description: "Manage users",
      },
      {
        label: "Manage Roles",
        code: Permission.ManageRoles,
        description: "Manage roles",
      },
      {
        label: "Manage Permissions",
        code: Permission.ManagePermissions,
        description: "Manage permissions",
      },
    ]);

    await queryInterface.select(null, "permissions", {
      where: {
        code: {
          [Op.in]: [
            Permission.ManageUsers,
            Permission.ManageRoles,
            Permission.ManagePermissions,
          ],
        },
      },
    });

    await queryInterface.bulkInsert("roles", [
      {
        label: "Admin",
        code: Role.Admin,
        description: "Administrator role",
      },
      {
        label: "Principal",
        code: Role.Principal,
        description: "Principal role",
      },
      {
        label: "Teacher",
        code: Role.Teacher,
        description: "Teacher role",
      },
      {
        label: "Student",
        code: Role.Student,
        description: "Student role",
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("permissions", {
      code: {
        [Op.in]: [
          Permission.ManageUsers,
          Permission.ManageRoles,
          Permission.ManagePermissions,
        ],
      },
    });

    await queryInterface.bulkDelete("roles", {
      code: {
        [Op.in]: ["admin", "principal", "teacher", "student"],
      },
    });
  },
};
