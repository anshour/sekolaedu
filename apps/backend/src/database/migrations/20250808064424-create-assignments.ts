"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("assignments", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      classroom_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "classrooms",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      subject_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "subjects",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      teacher_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "teachers",
          },
          key: "id",
        },
        onDelete: "SET NULL",
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      start_date: { type: DataTypes.DATE, allowNull: false },
      due_date: { type: DataTypes.DATE, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("assignments", ["subject_id"]);

    // TODO: CREATE ASSIGNMENT SUBMISSIONS TABLE
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("assignments");
  },
};
