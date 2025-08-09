"use strict";

import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Example:
    // await queryInterface.createTable('users', {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   name: {
    //     type: DataTypes.STRING,
    //   },
    // });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Example:
    // await queryInterface.dropTable('users');
  },
};
