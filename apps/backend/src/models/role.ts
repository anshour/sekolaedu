import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { PermissionModel } from "./permission";
import { PermissionableModel } from "./permissionable";

export class RoleModel extends BaseModel<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare label: string;
  declare description: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsToMany(PermissionModel, {
      through: {
        model: PermissionableModel,
        unique: false,
        scope: { where: { type: "role" } },
      },
      foreignKey: "permissionable_id",
      otherKey: "permission_id",
      constraints: false,
      as: "permissions",
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
        code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        label: { type: DataTypes.STRING(100), allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        tableName: "roles",
        modelName: "Role",
      },
    );
  }
}

export interface RoleAttribute extends InferAttributes<RoleModel> {}
