import { type Request, type Response } from "express";
import TeacherService from "~/services/teacher-service";
import { createPaginationSchema } from "~/types/pagination";
import validate from "~/utils/validate";

const teacherController = {
  async getTeachers(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["name"],
      allowedSorts: ["name"],
    });

    const params = validate(schema, req.query);

    const teachers = await TeacherService.getAll(params);
    res.status(200).json(teachers);
  },
};

export default teacherController;
