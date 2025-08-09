"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("lessons", {
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("lessons", ["subject_id"]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("lessons");
  },
};
