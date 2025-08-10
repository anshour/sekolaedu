import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { UserModel } from "./user";
import { ClassroomModel } from "./classroom";
import { ClassroomMemberModel } from "./classroom_member";

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

  static associate() {
    this.belongsTo(UserModel, {
      foreignKey: "user_id",
      as: "user",
    });

    this.belongsTo(ClassroomModel, {
      foreignKey: "current_classroom_id",
      as: "current_classroom",
    });

    this.belongsToMany(ClassroomModel, {
      through: {
        model: ClassroomMemberModel,
      },
      foreignKey: "student_id",
      as: "classrooms",
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
  }
}

export interface StudentAttribute extends InferAttributes<StudentModel> {}
