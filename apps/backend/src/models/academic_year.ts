import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { baseInit, BaseModel } from "./base";
import { ClassroomModel } from "./classroom";

export class AcademicYearModel extends BaseModel<
  InferAttributes<AcademicYearModel>,
  InferCreationAttributes<AcademicYearModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare start_date: Date;
  declare end_date: Date;
  declare is_active: boolean;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static associate() {
    this.hasMany(ClassroomModel, {
      foreignKey: "academic_year_id",
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        ...baseInit,
        modelName: "AcademicYear",
        tableName: "academic_years",
      },
    );
  }
}

export interface AcademicYearAttribute
  extends InferAttributes<AcademicYearModel> {}
