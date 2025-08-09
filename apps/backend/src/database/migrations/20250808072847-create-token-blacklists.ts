"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("token_blacklists", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: { type: DataTypes.TEXT, allowNull: false, unique: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      expires_at: { type: DataTypes.DATE, allowNull: false }, //TODO: Delete the token blacklist after this date
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("token_blacklists", ["user_id"]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("token_blacklists");
  },
};
