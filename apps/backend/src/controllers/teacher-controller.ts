import { type Request, type Response } from "express";
import TeacherService from "~/services/teacher-service";
import { HttpError } from "~/types/http-error";
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

  async getTeacherById(req: Request, res: Response) {
    const { id } = req.params;

    const teacher = await TeacherService.getById(Number(id));

    if (!teacher) {
      throw new HttpError("Teacher not found", 404);
    }

    res.status(200).json(teacher);
  },
};

export default teacherController;
