"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("examinations", {
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
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false }, // Duration in minutes
      minimum_passing_score: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING(50), allowNull: false }, // e.g., "midterm", "final", "quiz"
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    //TODO: CREATE EXAMINATION SUBMISSIONS TABLE
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("examinations");
  },
};
