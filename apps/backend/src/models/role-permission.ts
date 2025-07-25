import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";

export class RolePermissionModel extends BaseModel<
  InferAttributes<RolePermissionModel>,
  InferCreationAttributes<RolePermissionModel>
> {
  declare id: CreationOptional<number>;
  declare role_id: number;
  declare permission_id: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

RolePermissionModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "roles",
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
    modelName: "RolePermission",
    tableName: "role_permissions",
  },
);
