import { AcademicYear } from "~/models/academic_year";
import db from "../database/connection";

class AcademicYearService {
  static async getAll(): Promise<AcademicYear[]> {
    const academicYears = await db("academic_years").select("*");

    return academicYears;
  }

  static async getActive(): Promise<AcademicYear | null> {
    const activeAcademicYear = await db("academic_years")
      .where({ is_active: true })
      .first();

    return activeAcademicYear || null;
  }
}

export default AcademicYearService;
