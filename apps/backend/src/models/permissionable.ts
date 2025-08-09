import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { PermissionAttribute, PermissionModel } from "./permission";

export class PermissionableModel extends BaseModel<
  InferAttributes<PermissionableModel>,
  InferCreationAttributes<PermissionableModel>
> {
  declare permission_id: number;
  declare permissionable_id: number;
  declare permissionable_type: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare permission: NonAttribute<PermissionAttribute>;

  static associate() {
    this.belongsTo(PermissionModel, {
      foreignKey: "permission_id",
      as: "permission",
    });
  }

  static initModel() {
    this.init(
      {
        permission_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: PermissionModel,
            key: "id",
          },
        },
        permissionable_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permissionable_type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "Permissionable",
        tableName: "permissionables",
      },
    );
  }
}

export interface PermissionableAttribute
  extends InferAttributes<PermissionableModel> {}
