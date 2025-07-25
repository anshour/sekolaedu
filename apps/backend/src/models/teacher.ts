import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";

export class TeacherModel extends BaseModel<
  InferAttributes<TeacherModel>,
  InferCreationAttributes<TeacherModel>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare type: "regular" | "assistant";
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export interface TeacherAttribute extends InferAttributes<TeacherModel> {}

TeacherModel.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    ...baseInit,
    modelName: "Teacher",
    tableName: "teachers",
  },
);
