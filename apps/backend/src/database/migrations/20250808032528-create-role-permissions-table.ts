"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("permissions", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      label: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("permissionables", {
      permission_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: { tableName: "permissions" },
          key: "id",
        },
      },
      permissionable_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      permissionable_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("permissionables", [
      "permissionable_id",
      "permissionable_type",
    ]);

    await queryInterface.createTable("roles", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      label: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("permissions");
    await queryInterface.dropTable("permissionables");
    await queryInterface.dropTable("roles");
  },
};
