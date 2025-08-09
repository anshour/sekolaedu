"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("attendances", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      type: { type: DataTypes.STRING(100), allowNull: false }, // e.g., "daily", "exam", "event"
      status: {
        type: DataTypes.ENUM("present", "late", "sick", "excused", "absent"),
        allowNull: false,
      },
      student_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "students",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      academic_year_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "academic_years",
          },
          key: "id",
        },
        onDelete: "CASCADE",
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
      date: { type: DataTypes.DATEONLY, allowNull: false }, // Date of attendance
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
    await queryInterface.dropTable("attendances");
  },
};
