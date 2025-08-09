"use strict";

import { QueryInterface, Op } from "sequelize";
import { Permission } from "~/constants/permissions";
import { Role } from "~/constants/roles";
import { UserModel } from "~/models";

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const insertedPermissions = await queryInterface.select(
      null,
      "permissions",
      {
        where: {
          code: {
            [Op.in]: [
              Permission.ManageUsers,
              Permission.ManageRoles,
              Permission.ManagePermissions,
            ],
          },
        },
      },
    );

    const insertedRoles = await queryInterface.select(null, "roles", {
      where: {
        code: {
          [Op.in]: [Role.Admin, Role.Principal, Role.Teacher, Role.Student],
        },
      },
    });

    const userAdmin = await UserModel.findOne({
      where: { email: "admin@example.com" },
    });

    // @ts-expect-error sequelize mixin not recognized
    await userAdmin.addPermissions(insertedPermissions.map((p: any) => p.id));

    await userAdmin?.update({
      // @ts-expect-error
      role_id: insertedRoles.find((x) => x.code === Role.Admin)?.id,
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const userAdmin = await UserModel.findOne({
      where: { email: "admin@example.com" },
    });

    // @ts-expect-error
    const adminPermissions = await userAdmin?.getPermissions();

    await queryInterface.bulkDelete("permissionables", {
      permissionable_type: "user",
      permissionable_id: userAdmin?.id,
      permission_id: {
        [Op.in]: adminPermissions?.map((p: any) => p.id) || [],
      },
    });
  },
};
