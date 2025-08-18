"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("subjects", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      academic_year_id: {
        type: DataTypes.BIGINT,
        references: {
          model: {
            tableName: "academic_years",
          },
        },
        key: "id",
        onDelete: "SET NULL",
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
      name: { type: DataTypes.STRING(100), allowNull: false },
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
    await queryInterface.dropTable("subjects");
  },
};
