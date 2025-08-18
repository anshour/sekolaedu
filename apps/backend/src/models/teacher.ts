import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { UserModel } from "./user";
import { SubjectModel } from "./subject";

export class TeacherModel extends BaseModel<
  InferAttributes<TeacherModel>,
  InferCreationAttributes<TeacherModel>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare type: "regular" | "assistant";
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.belongsTo(UserModel, {
      foreignKey: "user_id",
      as: "user",
    });

    this.hasMany(SubjectModel, {
      foreignKey: "teacher_id",
      as: "subjects",
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
        scopes: {
          withUser: {
            include: [
              {
                association: "user",
                attributes: ["id", "name"],
              },
            ],
          },
          withSubjects: {
            include: [
              {
                association: "subjects",
                attributes: ["id", "name"],
              },
            ],
          },
        },
      },
    );
  }
}

export interface TeacherAttribute extends InferAttributes<TeacherModel> {}
