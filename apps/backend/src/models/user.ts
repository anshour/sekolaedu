import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { PermissionModel } from "./permission";
import { PermissionableModel } from "./permissionable";
import { RoleAttribute, RoleModel } from "./role";

export class UserModel extends BaseModel<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare photo_url: string | null;
  declare email: string;
  declare is_active: CreationOptional<boolean>;
  declare password?: string;
  declare role_id: number | null;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare role: NonAttribute<RoleAttribute>;

  static associate() {
    this.belongsTo(RoleModel, {
      foreignKey: "role_id",
      as: "role",
    });

    this.belongsToMany(PermissionModel, {
      through: {
        model: PermissionableModel,
        unique: false,
        scope: { permissionable_type: "user" },
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        photo_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        role_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "User",
        tableName: "users",
        defaultScope: {
          attributes: { exclude: ["password"] },
        },
        scopes: {
          withPassword: {
            attributes: undefined,
          },
        },
      },
    );
  }
}

export interface UserAttribute extends InferAttributes<UserModel> {}
