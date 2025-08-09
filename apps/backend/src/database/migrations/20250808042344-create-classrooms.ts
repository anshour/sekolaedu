"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("classrooms", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(50), allowNull: false },
      count_students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      guardian_teacher_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: {
            tableName: "teachers",
          },
          key: "id",
        },
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
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("classrooms");
  },
};
