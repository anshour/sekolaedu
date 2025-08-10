"use strict";

import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("classroom_members", {
      classroom_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: { tableName: "classrooms" },
          key: "id",
        },
        onDelete: "CASCADE",
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
    });

    await queryInterface.addConstraint("classroom_members", {
      fields: ["classroom_id", "student_id"],
      type: "primary key",
      name: "pk_classroom_members",
    });

    await queryInterface.addIndex("classroom_members", ["classroom_id"]);
    await queryInterface.addIndex("classroom_members", ["student_id"]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeIndex("classroom_members", ["classroom_id"]);
    await queryInterface.removeIndex("classroom_members", ["student_id"]);
    await queryInterface.dropTable("classroom_members");
  },
};
