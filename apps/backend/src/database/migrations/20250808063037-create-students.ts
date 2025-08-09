"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("students", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      current_classroom_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: {
            tableName: "classrooms",
          },
          key: "id",
        },
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM(
          "active",
          "graduated",
          "candidate",
          "dropped",
          "transferred",
        ),
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

    await queryInterface.addIndex("students", ["user_id"]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("students");
  },
};
