import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { PermissionableModel } from "./permissionable";
import { UserModel } from "./user";

export class PermissionModel extends BaseModel<
  InferAttributes<PermissionModel>,
  InferCreationAttributes<PermissionModel>
> {
  declare id: CreationOptional<number>;
  declare label: string;
  declare code: string;
  declare description: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsToMany(UserModel, {
      through: {
        model: PermissionableModel,
        unique: false,
        scope: { permissionable_type: "user" },
      },
      foreignKey: "permission_id",
      otherKey: "permissionable_id",
      constraints: false,
      as: "users",
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
        label: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "Permission",
        tableName: "permissions",
      },
    );
  }
}

export interface PermissionAttribute extends InferAttributes<PermissionModel> {}
