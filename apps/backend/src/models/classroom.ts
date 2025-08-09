import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { TeacherModel } from "./teacher";

export class ClassroomModel extends BaseModel<
  InferAttributes<ClassroomModel>,
  InferCreationAttributes<ClassroomModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare academic_year_id: number;
  declare count_students: number;
  declare guardian_teacher_id: number | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsTo(TeacherModel, {
      foreignKey: "guardian_teacher_id",
      as: "guardian_teacher",
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
        academic_year_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        count_students: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        guardian_teacher_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "Classroom",
        tableName: "classrooms",
      },
    );
  }
}

export interface ClassroomAttribute extends InferAttributes<ClassroomModel> {}
