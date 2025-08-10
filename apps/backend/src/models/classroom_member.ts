import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { baseInit, BaseModel } from "./base";

export class ClassroomMemberModel extends BaseModel<
  InferAttributes<ClassroomMemberModel>,
  InferCreationAttributes<ClassroomMemberModel>
> {
  declare classroom_id: number;
  declare student_id: number;

  static associate() {}

  static initModel() {
    this.init(
      {
        classroom_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        student_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
      },
      {
        ...baseInit,
        timestamps: false,
        modelName: "ClassroomMember",
        tableName: "classroom_members",
      },
    );
  }
}

export interface ClassroomMemberAttribute
  extends InferAttributes<ClassroomMemberModel> {}
