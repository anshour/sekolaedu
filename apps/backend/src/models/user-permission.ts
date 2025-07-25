import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";

export class UserPermissionModel extends BaseModel<
  InferAttributes<UserPermissionModel>,
  InferCreationAttributes<UserPermissionModel>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare permission_id: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

UserPermissionModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    ...baseInit,
    modelName: "UserPermission",
    tableName: "user_permissions",
  },
);
