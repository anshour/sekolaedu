import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { TeacherModel } from "./teacher";

export class SubjectModel extends BaseModel<
  InferAttributes<SubjectModel>,
  InferCreationAttributes<SubjectModel>
> {
  declare id: CreationOptional<number>;
  declare classroom_id: number;
  declare teacher_id: number | null;
  declare name: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsTo(TeacherModel, {
      foreignKey: "teacher_id",
      as: "teacher",
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
        classroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        teacher_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "Subject",
        tableName: "subjects",
      },
    );
  }
}

export interface SubjectAttribute extends InferAttributes<SubjectModel> {}
