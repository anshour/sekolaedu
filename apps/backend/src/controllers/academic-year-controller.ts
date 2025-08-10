import { type Request, type Response } from "express";
import { z } from "zod/v4";
import AcademicYearService from "~/services/academic-year-service";
import { HttpError } from "~/types/http-error";
import validate from "~/utils/validate";

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

  async store(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
      start_date: z.iso.date(),
      end_date: z.iso.date(),
      is_active: z.boolean().optional().default(false),
    });
    const data = validate(schema, req.body);

    const newAcademicYear = await AcademicYearService.create(data);
    res.status(201).json(newAcademicYear);
  },
};

export default academicYearController;
