import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import { RoleAttribute, RoleModel } from "./role";
import { baseInit, BaseModel } from "./base";

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
  declare role_id: number;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare role: NonAttribute<RoleAttribute>;
}

export interface UserAttribute extends InferAttributes<UserModel> {}

UserModel.init(
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
      allowNull: false,
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

UserModel.belongsTo(RoleModel, {
  foreignKey: "role_id",
  as: "role",
});
