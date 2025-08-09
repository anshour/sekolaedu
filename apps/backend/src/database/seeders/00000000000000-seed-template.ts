"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    // await queryInterface.bulkInsert("users", [
    //   {
    //     name: "John Doe",
    //     email: "john@example.com",
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     name: "Jane Smith",
    //     email: "jane@example.com",
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    // ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // await queryInterface.bulkDelete("users", {
    //   email: ["john@example.com", "jane@example.com"],
    // });
  },
};
