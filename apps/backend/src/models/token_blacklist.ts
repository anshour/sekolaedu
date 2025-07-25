import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";

export class TokenBlacklistModel extends BaseModel<
  InferAttributes<TokenBlacklistModel>,
  InferCreationAttributes<TokenBlacklistModel>
> {
  declare id: CreationOptional<number>;
  declare token: string;
  declare user_id: number;
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

TokenBlacklistModel.init(
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
  { ...baseInit, modelName: "TokenBlackist", tableName: "token_blacklists" },
);
