import { type Request, type Response } from "express";
import AcademicYearService from "~/services/academic-year-service";
import { HttpError } from "~/types/http-error";

const academicYearController = {
  async getAll(req: Request, res: Response) {
    const academicYears = await AcademicYearService.getAll();
    res.status(200).json(academicYears);
  },

  async getActive(req: Request, res: Response) {
    const activeAcademicYear = await AcademicYearService.getActive();

    if (!activeAcademicYear) {
      throw new HttpError("No active academic year found", 404);
    }

    res.status(200).json(activeAcademicYear);
  },
};

export default academicYearController;
