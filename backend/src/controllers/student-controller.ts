import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import { createPaginationSchema } from "~/types/pagination";
import StudentService from "~/services/student-service";

const studentController = {
  async getStudents(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["current_classroom_id", "user_name"],
      allowedSorts: ["name"],
    });

    const params = validate(schema, req.query);

    const users = await StudentService.getAll(params);
    res.status(200).json(users);
  },
};

export default studentController;
