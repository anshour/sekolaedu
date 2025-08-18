import { AcademicYearAttribute, AcademicYearModel } from "~/models";
import dayjs from "dayjs";
import { CreationAttributes, Op } from "sequelize";

class AcademicYearService {
  static async getAll(): Promise<AcademicYearAttribute[]> {
    const academicYears = await AcademicYearModel.findAll({ raw: true });

    return academicYears;
  }

  static async getById(id: number): Promise<AcademicYearAttribute | null> {
    const academicYear = await AcademicYearModel.findByPk(id, { raw: true });

    return academicYear;
  }

  static async getActive(): Promise<AcademicYearAttribute | null> {
    const activeAcademicYear = await AcademicYearModel.findOne({
      where: {
        is_active: true,
      },
      raw: true,
    });

    return activeAcademicYear || null;
  }

  static async create(
    data: CreationAttributes<AcademicYearModel>,
  ): Promise<AcademicYearAttribute> {
    const newAcademicYear = await AcademicYearModel.create(data);

    await this.renewActive();

    return newAcademicYear;
  }

  static async renewActive(): Promise<void> {
    const today = dayjs().toISOString();

    const shouldActiveYears = await AcademicYearModel.findAll({
      where: {
        start_date: {
          [Op.lte]: today,
        },
        end_date: {
          [Op.gte]: today,
        },
      },
      order: [["start_date", "desc"]],
    });

    if (shouldActiveYears.length > 0) {
      const activeYear = shouldActiveYears[0];

      await AcademicYearModel.update(
        { is_active: true },
        {
          where: { id: activeYear.id },
        },
      );

      await AcademicYearModel.update(
        {
          is_active: false,
        },
        {
          where: { id: { [Op.not]: activeYear.id } },
        },
      );
    }
  }
}

export default AcademicYearService;
