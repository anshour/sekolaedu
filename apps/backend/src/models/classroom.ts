import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { TeacherAttribute, TeacherModel } from "./teacher";
import { StudentModel } from "./student";
import { ClassroomMemberModel } from "./classroom_member";

export class ClassroomModel extends BaseModel<
  InferAttributes<ClassroomModel>,
  InferCreationAttributes<ClassroomModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare count_students: CreationOptional<number>;
  declare academic_year_id: number;
  declare level: number;
  declare students: NonAttribute<StudentModel[]> | null;
  declare guardian_teacher_id: number | null;
  declare guardian_teacher: NonAttribute<TeacherAttribute> | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsTo(TeacherModel, {
      foreignKey: "guardian_teacher_id",
      as: "guardian_teacher",
    });

    this.belongsToMany(StudentModel, {
      through: {
        model: ClassroomMemberModel,
      },
      foreignKey: "classroom_id",
      as: "students",
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
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        count_students: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
