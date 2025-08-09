import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { UserModel } from "./user";

export class PasswordResetModel extends BaseModel<
  InferAttributes<PasswordResetModel>,
  InferCreationAttributes<PasswordResetModel>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare email: string;
  declare token: string;
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsTo(UserModel, {
      foreignKey: "user_id",
      as: "user",
    });
  }

  static initModel() {
    this.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "PasswordReset",
        tableName: "password_resets",
      },
    );
  }
}

export interface PasswordResetAttribute
  extends InferAttributes<PasswordResetModel> {}
