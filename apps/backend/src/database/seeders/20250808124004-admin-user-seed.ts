"use strict";

import { QueryInterface, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const hashedPassword = await bcrypt.hash("password", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        is_active: true,
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("users", {
      email: ["admin@example.com"],
    });
  },
};
