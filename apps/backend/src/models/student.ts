import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "~/database/sequelize";
import { baseInit, BaseModel } from "./base";

export class StudentModel extends BaseModel<
  InferAttributes<StudentModel>,
  InferCreationAttributes<StudentModel>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare current_classroom_id: number | null;
  declare status:
    | "active"
    | "candidate"
    | "graduated"
    | "dropped"
    | "transferred";
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export interface StudentAttribute extends InferAttributes<StudentModel> {}

StudentModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    current_classroom_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    ...baseInit,
    modelName: "Student",
    tableName: "students",
  },
);
