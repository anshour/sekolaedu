import { AcademicYearAttribute } from "~/models/academic_year";
import db from "../database/connection";
import dayjs from "dayjs";

class AcademicYearService {
  static async getAll(): Promise<AcademicYearAttribute[]> {
    const academicYears = await db("academic_years").select("*");

    return academicYears;
  }

  static async getActive(): Promise<AcademicYearAttribute | null> {
    const activeAcademicYear = await db("academic_years")
      .where({ is_active: true })
      .first();

    return activeAcademicYear || null;
  }

  static async create(
    data: Partial<AcademicYearAttribute>,
  ): Promise<AcademicYearAttribute> {
    const [newAcademicYear] = await db("academic_years")
      .insert(data)
      .returning("*");

    await this.renewActive();

    return newAcademicYear;
  }

  static async renewActive(): Promise<void> {
    const today = dayjs().toISOString();

    const shouldActiveYears = await db("academic_years")
      .where("start_date", "<=", today)
      .andWhere("end_date", ">=", today)
      .orderBy("start_date", "desc");

    if (shouldActiveYears.length > 0) {
      const activeYear = shouldActiveYears[0];

      await db("academic_years")
        .where({ id: activeYear.id })
        .update({ is_active: true });

      await db("academic_years")
        .whereNot({ id: activeYear.id })
        .update({ is_active: false });
    }
  }
}

export default AcademicYearService;
